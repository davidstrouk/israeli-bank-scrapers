# OTP Authentication Example - Setup Complete! 🎉

## What Was Created

Your OTP authentication example script is now ready to use! Here's what was added to your project:

### 📁 Files Created

```
israeli-bank-scrapers/
├── examples/
│   ├── .gitignore                    # Protects sensitive credentials
│   ├── README.md                     # Detailed documentation
│   ├── SETUP.md                      # This file
│   └── otp-authentication.ts         # ✨ Main example script (TypeScript)
├── QUICKSTART_OTP.md                 # Quick start guide
└── package.json                      # Updated with new script
```

### 🚀 New npm Script

A convenient npm script was added to `package.json`:

```bash
npm run example:otp
```

### 📦 Dependencies

Added `enquirer` as an optional dependency for interactive prompts.

## How to Run

### Option 1: Quick Start (Recommended)

```bash
# Step 1: Install dependencies (includes ts-node)
npm install

# Step 2: Run the example
npm run example:otp
```

### Option 1b: With Debug Logging

```bash
# Run with debug logs enabled
DEBUG=israeli-bank-scrapers:* npm run example:otp
```

### Option 2: With Your Credentials

```bash
BANK_EMAIL=your@email.com \
BANK_PASSWORD=yourpassword \
BANK_PHONE=+972501234567 \
npm run example:otp
```

### Option 3: Edit the Script Directly

1. Open `examples/otp-authentication.ts`
2. Edit the `accountConfig` object (around line 17):
   ```typescript
   const accountConfig: AccountCredentials = {
     email: 'your@email.com',
     password: 'yourpassword',
     phoneNumber: '+972501234567',
     companyId: CompanyTypes.oneZero, // Change to your bank
   };
   ```
3. Run: `npm run example:otp`

## What the Script Does

The script demonstrates **two different OTP authentication methods**:

### 🔐 Option 1: OTP Callback Authentication
- Works with **all banks**
- Prompts you for OTP during login
- Best for interactive applications
- No token management needed

### 🎫 Option 2: Long-term Token (OneZero Only)
- Only for **OneZero bank**
- Gets a reusable authentication token
- No OTP needed after first setup
- Perfect for automation

## Interactive Menu

When you run the script, you'll see:

```
🏦 Israeli Bank Scrapers - OTP Authentication Examples

? Choose authentication method: (Use arrow keys)
❯ Option 1: OTP Callback (works with all banks)
  Option 2: Long-term Token (OneZero only)
  Exit
```

Just select your preferred method and follow the prompts!

## Example Flow

### For Option 1 (OTP Callback):
1. Select "Option 1: OTP Callback"
2. The script will attempt to login
3. When OTP is needed, you'll be prompted: `Enter OTP Code:`
4. Enter the code you received via SMS
5. The script will login and fetch your transactions
6. Results will be displayed in the console

### For Option 2 (Long-term Token - OneZero):
1. Select "Option 2: Long-term Token"
2. The script triggers two-factor authentication
3. You'll receive an OTP via SMS
4. Enter the OTP when prompted
5. The script exchanges it for a long-term token
6. Your token is displayed (save it securely!)
7. The script demonstrates using the token to login
8. No OTP needed on subsequent logins!

## Security Notes

### ⚠️ Important Security Considerations:

1. **Never commit credentials**: The `.gitignore` file in the examples directory protects you
2. **Use environment variables**: Store credentials in `.env` files or environment variables
3. **Secure token storage**: Long-term tokens should be stored securely (e.g., in a vault)
4. **Rotate tokens**: Generate new tokens periodically for better security

### Example .env file:

Create a `.env` file in the examples directory:

```bash
# .env (this file is gitignored)
BANK_EMAIL=your@email.com
BANK_PASSWORD=yourpassword
BANK_PHONE=+972501234567
BANK_LONG_TERM_TOKEN=eyJraWQiOiJiNzU3OGM5Yy0wM2YyLTRkMzktYjBm...
```

Then use `dotenv`:
```bash
npm install dotenv
```

```javascript
require('dotenv').config();
// Now use process.env.BANK_EMAIL, etc.
```

## Supported Banks

Change `companyId` to match your bank:

```javascript
CompanyTypes.hapoalim       // Bank Hapoalim
CompanyTypes.leumi          // Bank Leumi
CompanyTypes.discount       // Discount Bank
CompanyTypes.mizrahi        // Mizrahi Tefahot
CompanyTypes.oneZero        // One Zero (supports long-term tokens!)
CompanyTypes.isracard       // Isracard
CompanyTypes.max            // Max (Leumi Card)
CompanyTypes.visaCal        // Visa CAL
CompanyTypes.amex           // American Express
CompanyTypes.unionBank      // Union Bank
CompanyTypes.beinleumi      // Beinleumi
CompanyTypes.massad         // Massad
CompanyTypes.yahav          // Yahav
CompanyTypes.beyahadBishvilha // Beyahad Bishvilha
CompanyTypes.mercantile     // Mercantile
```

## Troubleshooting

### 🔧 Common Issues and Solutions:

| Issue | Solution |
|-------|----------|
| `Cannot find module 'enquirer'` or `'ts-node'` | Run `npm install` |
| `Please configure your credentials` | Set env vars or edit the script |
| OTP not accepted | Enter quickly, verify phone format (+972...) |
| Script doesn't run | Make sure Node.js >= 18.19.0 is installed |
| TypeScript errors | Check your tsconfig.json settings |

## Next Steps

1. **Try the example**: Run `npm run example:otp` to see it in action
2. **Read the docs**: Check out `examples/README.md` for more details
3. **Integrate**: Copy the relevant code into your application
4. **Customize**: Adapt the OTP retrieval logic to your needs
5. **Deploy**: Add proper error handling and logging for production

## Documentation

- 📖 **Quick Start Guide**: `QUICKSTART_OTP.md`
- 📚 **Detailed Docs**: `examples/README.md`
- 🔍 **Main README**: `README.md`
- 💻 **Source Code**: `examples/otp-authentication.ts`

## Help & Support

- **GitHub Issues**: https://github.com/eshaham/israeli-bank-scrapers/issues
- **Documentation**: https://github.com/eshaham/israeli-bank-scrapers
- **Example Code**: See the `examples/` directory

---

**Ready to start?** Run:

```bash
npm run example:otp
```

Enjoy scraping! 🚀

