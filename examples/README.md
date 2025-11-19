# Israeli Bank Scrapers - Examples

This directory contains example scripts demonstrating how to use the Israeli Bank Scrapers library.

## OTP Authentication Example

The `otp-authentication.ts` script demonstrates two methods for handling OTP (One-Time Password) authentication when using the library.

### Prerequisites

1. Install dependencies (including ts-node and enquirer):
   ```bash
   npm install
   ```

### Running the Example

#### Option 1: Using npm script

```bash
npm run example:otp
```

#### Option 1b: With debug logging

```bash
# Enable debug logs for all scrapers
DEBUG=israeli-bank-scrapers:* npm run example:otp

# Enable debug logs for specific scraper (e.g., OneZero)
DEBUG=israeli-bank-scrapers:one-zero npm run example:otp
```

#### Option 2: Using environment variables

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

#### Option 3: Edit the script

Open `examples/otp-authentication.ts` and edit the `accountConfig` object with your credentials:

```javascript
const accountConfig = {
  email: 'your@email.com',
  password: 'yourpassword',
  phoneNumber: '+972501234567',
  companyId: CompanyTypes.oneZero, // Change to your bank
};
```

Then run:

```bash
npm run example:otp
```

### Authentication Methods Explained

#### Method 1: OTP Callback Authentication

This method works with **all banks that support OTP**. You provide a callback function that will be called when an OTP code is needed:

```javascript
const result = await scraper.login({
  email: 'your@email.com',
  password: 'yourpassword',
  phoneNumber: '+972501234567',
  otpCodeRetriever: async () => {
    // This function is called when OTP is needed
    // You can get the code from user input, SMS gateway, etc.
    const otpCode = await promptUserForOTP();
    return otpCode;
  }
});
```

**Use this when:**
- You want to prompt the user for OTP during login
- You're building an interactive application
- You need to work with multiple banks

#### Method 2: Long-term Token (OneZero Only)

This method is **specific to OneZero bank** and allows you to obtain a long-term authentication token that can be reused for future logins without requiring OTP each time:

```javascript
// Step 1: Trigger two-factor authentication
await scraper.triggerTwoFactorAuth(phoneNumber);

// Step 2: Get OTP code (sent via SMS)
const otpCode = '123456'; // Get this from user

// Step 3: Exchange OTP for long-term token
const result = await scraper.getLongTermTwoFactorToken(otpCode);

// result.longTermTwoFactorAuthToken contains the token
// Save this token securely!

// Step 4: Use the token for future logins
const loginResult = await scraper.login({
  email: 'your@email.com',
  password: 'yourpassword',
  otpLongTermToken: result.longTermTwoFactorAuthToken
});
```

**Use this when:**
- You're working with OneZero bank specifically
- You want to avoid OTP prompts on every login
- You're building a background service or automation
- You can securely store the long-term token

**Security Note:** The long-term token should be stored securely (e.g., in environment variables or a secure vault) as it provides access to the account without requiring OTP.

### Available Banks (CompanyTypes)

The library supports the following banks and credit card companies:

- `CompanyTypes.hapoalim` - Bank Hapoalim
- `CompanyTypes.leumi` - Bank Leumi
- `CompanyTypes.discount` - Discount Bank
- `CompanyTypes.otsarHahayal` - Otsar Hahayal
- `CompanyTypes.visaCal` - Visa CAL
- `CompanyTypes.max` - Max (Leumi Card)
- `CompanyTypes.isracard` - Isracard
- `CompanyTypes.amex` - American Express
- `CompanyTypes.mizrahi` - Mizrahi Tefahot Bank
- `CompanyTypes.unionBank` - Union Bank
- `CompanyTypes.beinleumi` - Beinleumi
- `CompanyTypes.massad` - Massad
- `CompanyTypes.yahav` - Yahav
- `CompanyTypes.beyahadBishvilha` - Beyahad Bishvilha
- `CompanyTypes.oneZero` - One Zero Bank
- `CompanyTypes.mercantile` - Mercantile Bank

### Troubleshooting

#### Error: Cannot find module 'enquirer' or 'ts-node'

Install the dependencies:
```bash
npm install
```

#### Credentials not set

Make sure to either:
1. Set environment variables (`BANK_EMAIL`, `BANK_PASSWORD`, `BANK_PHONE`), OR
2. Edit the `accountConfig` object in the script

### Support

For issues, questions, or contributions, please visit:
https://github.com/eshaham/israeli-bank-scrapers

