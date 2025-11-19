# Quick Start Guide: OTP Authentication

This guide shows you how to use the OTP authentication example script included with Israeli Bank Scrapers.

## Prerequisites

1. **Install dependencies** (includes ts-node and enquirer):
   ```bash
   npm install
   ```

## Running the Example

### Method 1: Quick Run with npm

```bash
npm run example:otp
```

Then follow the interactive prompts to select your authentication method.

### Method 1b: With Debug Logging

```bash
# Enable debug logs to see detailed scraping process
DEBUG=israeli-bank-scrapers:* npm run example:otp
```

### Method 2: With Environment Variables

```bash
BANK_EMAIL=your@email.com \
BANK_PASSWORD=yourpassword \
BANK_PHONE=+972501234567 \
npm run example:otp
```

### Method 3: Direct Node Execution

```bash
BANK_EMAIL=your@email.com \
BANK_PASSWORD=yourpassword \
BANK_PHONE=+972501234567 \
npm run example:otp
```

Or run directly with ts-node:

```bash
BANK_EMAIL=your@email.com \
BANK_PASSWORD=yourpassword \
BANK_PHONE=+972501234567 \
npx ts-node examples/otp-authentication.ts
```

## Authentication Options

The example demonstrates two different OTP authentication approaches:

### Option 1: OTP Callback (Recommended for Most Use Cases)

✅ **Works with all banks**
✅ **Interactive and user-friendly**
✅ **No token management needed**

This option prompts the user for an OTP code during login:

```javascript
const scraper = createScraper({
  companyId: CompanyTypes.oneZero,
  verbose: true,
});

const result = await scraper.login({
  email: 'your@email.com',
  password: 'yourpassword',
  phoneNumber: '+972501234567',
  otpCodeRetriever: async () => {
    // Prompt user for OTP
    const otpCode = await askQuestion('Enter OTP Code: ');
    return otpCode;
  }
});
```

**Best for:**
- Interactive applications
- CLI tools
- One-time scraping sessions
- When you want users to authenticate each time

### Option 2: Long-term Token (OneZero Only)

✅ **No OTP needed after first setup**
✅ **Great for automation**
⚠️ **Only works with OneZero bank**

This option gets a long-term authentication token:

```javascript
const scraper = createScraper({
  companyId: CompanyTypes.oneZero,
  verbose: true,
});

// Step 1: Trigger OTP
await scraper.triggerTwoFactorAuth(phoneNumber);

// Step 2: Get token with OTP code
const tokenResult = await scraper.getLongTermTwoFactorToken('123456');

// Save the token securely
const token = tokenResult.longTermTwoFactorAuthToken;

// Step 3: Use token for future logins (no OTP needed)
const result = await scraper.login({
  email: 'your@email.com',
  password: 'yourpassword',
  otpLongTermToken: token
});
```

**Best for:**
- Background services
- Automated scheduled scraping
- Reducing OTP friction for OneZero users
- When you can securely store tokens

## Security Considerations

### For Long-term Tokens:
- **Store securely**: Use environment variables or a secure vault
- **Never commit**: Don't commit tokens to version control
- **Rotate regularly**: Generate new tokens periodically
- **Monitor usage**: Keep track of where tokens are used

Example of secure token storage:

```bash
# .env file (add to .gitignore!)
BANK_EMAIL=your@email.com
BANK_PASSWORD=yourpassword
BANK_LONG_TERM_TOKEN=eyJraWQiOiJiNzU3OGM5Yy0wM2YyLTRkMzktYjBm...
```

```javascript
require('dotenv').config();

const result = await scraper.login({
  email: process.env.BANK_EMAIL,
  password: process.env.BANK_PASSWORD,
  otpLongTermToken: process.env.BANK_LONG_TERM_TOKEN
});
```

## Supported Banks

The following banks and credit card companies are supported:

| Bank/Company | CompanyType | OTP Callback | Long-term Token |
|-------------|-------------|--------------|-----------------|
| Bank Hapoalim | `CompanyTypes.hapoalim` | ✅ | ❌ |
| Bank Leumi | `CompanyTypes.leumi` | ✅ | ❌ |
| Discount Bank | `CompanyTypes.discount` | ✅ | ❌ |
| Mizrahi Tefahot | `CompanyTypes.mizrahi` | ✅ | ❌ |
| One Zero | `CompanyTypes.oneZero` | ✅ | ✅ |
| Isracard | `CompanyTypes.isracard` | ✅ | ❌ |
| Max (Leumi Card) | `CompanyTypes.max` | ✅ | ❌ |
| Visa CAL | `CompanyTypes.visaCal` | ✅ | ❌ |
| American Express | `CompanyTypes.amex` | ✅ | ❌ |
| And more... | See examples/README.md | | |

## Troubleshooting

### Error: "Cannot find module 'enquirer'" or "Cannot find module 'ts-node'"

**Solution**: Install the dependencies:
```bash
npm install
```

### Error: "Please configure your credentials"

**Solution**: Set environment variables or edit the script:
```bash
BANK_EMAIL=user@example.com \
BANK_PASSWORD=pass \
BANK_PHONE=+972501234567 \
npm run example:otp
```

### OTP code not being accepted

**Solutions**:
- Make sure you're entering the code quickly (they expire)
- Check that you're using the correct phone number format (+972...)
- Verify you're using the OTP from the most recent SMS
- Try requesting a new OTP code

## Next Steps

1. **Read the full documentation**: See `examples/README.md` for more details
2. **Integrate into your app**: Copy and adapt the example code for your use case
3. **Add error handling**: Implement proper error handling for production use
4. **Secure your credentials**: Use environment variables or a secure vault

## Example Integration

Here's a minimal example of integrating OTP auth into your Node.js app:

```javascript
const { createScraper, CompanyTypes } = require('israeli-bank-scrapers');

async function scrapeMyBank() {
  const scraper = createScraper({
    companyId: CompanyTypes.oneZero,
  });

  // Login with OTP callback
  const loginResult = await scraper.login({
    email: process.env.BANK_EMAIL,
    password: process.env.BANK_PASSWORD,
    phoneNumber: process.env.BANK_PHONE,
    otpCodeRetriever: async () => {
      // Your custom OTP retrieval logic
      return await getOtpFromUser();
    }
  });

  if (!loginResult.success) {
    throw new Error(`Login failed: ${loginResult.errorMessage}`);
  }

  // Scrape transactions
  const result = await scraper.scrape({
    startDate: new Date('2024-01-01'),
  });

  if (result.success) {
    console.log('Transactions:', result.accounts);
  }
}

scrapeMyBank().catch(console.error);
```

## Support

For issues, questions, or contributions:
- **GitHub**: https://github.com/eshaham/israeli-bank-scrapers
- **Examples**: See the `examples/` directory
- **Documentation**: Check the main README.md

