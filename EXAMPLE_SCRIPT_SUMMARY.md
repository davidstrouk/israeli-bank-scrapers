# ✅ OTP Authentication Example - Complete!

The OTP authentication example has been successfully created and configured to use **TypeScript** instead of JavaScript.

## 📋 Summary of Changes

### Files Created
- ✅ `examples/otp-authentication.ts` - Main TypeScript example script
- ✅ `examples/README.md` - Comprehensive documentation
- ✅ `examples/SETUP.md` - Setup instructions
- ✅ `examples/.gitignore` - Protects sensitive credentials
- ✅ `examples/tsconfig.json` - TypeScript configuration for examples
- ✅ `QUICKSTART_OTP.md` - Quick start guide

### Files Updated
- ✅ `package.json` - Added `ts-node` dependency and `example:otp` script
- ✅ `.eslintignore` - Excluded examples from linting

### Files Removed
- ✅ `examples/otp-authentication.js` - Removed as requested

## 🚀 How to Run

### Quick Start

```bash
# Install dependencies (including ts-node)
npm install

# Run the example
npm run example:otp
```

### With Environment Variables

```bash
BANK_EMAIL=your@email.com \
BANK_PASSWORD=yourpassword \
BANK_PHONE=+972501234567 \
npm run example:otp
```

### Direct Execution

```bash
npx ts-node examples/otp-authentication.ts
```

## 🔑 Key Features

### Two Authentication Methods

#### Option 1: OTP Callback (All Banks)
- ✅ Works with all supported banks
- ✅ Interactive OTP prompt during scraping
- ✅ Simple and straightforward
- ✅ No token management needed

#### Option 2: Long-term Token (OneZero Only)
- ✅ Get a reusable authentication token
- ✅ No OTP needed after first setup
- ✅ Perfect for automation
- ✅ Secure token-based authentication

## 📝 Example Code Structure

The script demonstrates the correct API usage:

```typescript
import { CompanyTypes, createScraper } from 'israeli-bank-scrapers';

// Create scraper with all required options
const scraper = createScraper({
  companyId: CompanyTypes.oneZero,
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  verbose: true,
});

// Scrape with OTP callback
const result = await scraper.scrape({
  email: 'your@email.com',
  password: 'yourpassword',
  phoneNumber: '+972501234567',
  otpCodeRetriever: async () => {
    // Your OTP retrieval logic
    return await getOtpFromUser();
  },
});
```

## 🔧 Technical Details

### TypeScript Setup
- Uses `ts-node` to run TypeScript directly
- Separate `tsconfig.json` in examples directory
- Full type safety and IntelliSense support

### Dependencies
- ✅ `ts-node` - Execute TypeScript files directly
- ✅ `enquirer` - Interactive prompts
- ✅ All types from `israeli-bank-scrapers`

### Linting
- Examples directory excluded from ESLint checks
- Allows more flexible example code
- Maintains code quality in main source

## 📚 Documentation

Comprehensive documentation has been created:

1. **Quick Start**: `QUICKSTART_OTP.md` - Get started quickly
2. **Detailed Guide**: `examples/README.md` - Full documentation
3. **Setup Instructions**: `examples/SETUP.md` - Step-by-step setup
4. **Example Code**: `examples/otp-authentication.ts` - Fully commented

## 🎯 What the Script Does

### Interactive Menu
When you run the script, you'll see:
```
🏦 Israeli Bank Scrapers - OTP Authentication Examples

? Choose authentication method: (Use arrow keys)
❯ Option 1: OTP Callback (works with all banks)
  Option 2: Long-term Token (OneZero only)
  Exit
```

### Option 1 Flow
1. Creates scraper with configuration
2. Calls `scrape()` with credentials
3. Prompts for OTP when needed
4. Displays transaction results

### Option 2 Flow (OneZero)
1. Triggers two-factor authentication
2. Prompts for OTP code
3. Exchanges OTP for long-term token
4. Saves token for future use
5. Demonstrates scraping with token

## ✨ Key Improvements

### Correct API Usage
- ✅ Uses `scrape()` method (not separate login/scrape)
- ✅ Provides `startDate` when creating scraper
- ✅ Proper error handling with type checking
- ✅ Correct TypeScript types throughout

### Better Developer Experience
- ✅ TypeScript for type safety
- ✅ Interactive prompts
- ✅ Clear console output with emojis
- ✅ Comprehensive error messages
- ✅ Well-documented code

### Security
- ✅ `.gitignore` for sensitive files
- ✅ Environment variable support
- ✅ No hardcoded credentials in examples
- ✅ Secure token storage guidance

## 🔒 Security Best Practices

The example demonstrates:
- ✅ Using environment variables for credentials
- ✅ Secure token storage recommendations
- ✅ No sensitive data in version control
- ✅ Proper error handling to avoid leaking info

## 🎉 Ready to Use!

The script is fully functional and ready to run:

```bash
npm run example:otp
```

All documentation is in place, TypeScript is properly configured, and the code follows best practices for the israeli-bank-scrapers library.

## 📖 Next Steps for Users

1. **Read the documentation**: Start with `QUICKSTART_OTP.md`
2. **Install dependencies**: Run `npm install`
3. **Try the example**: Run `npm run example:otp`
4. **Adapt for your needs**: Copy and modify the code
5. **Deploy to production**: Add proper error handling and logging

---

**Need help?** Check the comprehensive documentation in:
- `QUICKSTART_OTP.md`
- `examples/README.md`
- `examples/SETUP.md`


