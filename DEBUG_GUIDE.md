# Debug Guide for Israeli Bank Scrapers

This guide explains how to enable and use debug logging when running the OTP authentication example or using the library in your own code.

## 🐛 Quick Start

Enable debug logging by setting the `DEBUG` environment variable:

```bash
DEBUG=israeli-bank-scrapers:* npm run example:otp
```

## Debug Levels

### 1. All Scrapers (Recommended for Troubleshooting)

Enable all debug logs from the israeli-bank-scrapers library:

```bash
DEBUG=israeli-bank-scrapers:* npm run example:otp
```

### 2. Specific Scraper

Debug only a specific bank/scraper:

```bash
# OneZero Bank
DEBUG=israeli-bank-scrapers:one-zero npm run example:otp

# Visa CAL
DEBUG=israeli-bank-scrapers:visa-cal npm run example:otp

# Max (Leumi Card)
DEBUG=israeli-bank-scrapers:max npm run example:otp

# Any other scraper (replace with scraper name)
DEBUG=israeli-bank-scrapers:SCRAPER_NAME npm run example:otp
```

### 3. Everything (Very Verbose)

Enable ALL debug logs including dependencies (not recommended unless debugging deep issues):

```bash
DEBUG=* npm run example:otp
```

## Combined with Credentials

You can combine debug flags with credential environment variables:

```bash
DEBUG=israeli-bank-scrapers:* \
BANK_EMAIL=your@email.com \
BANK_PASSWORD=yourpass \
BANK_PHONE=+972501234567 \
npm run example:otp
```

## Debug Output

When debug is enabled, you'll see detailed logs like:

```
israeli-bank-scrapers:one-zero Logging in... +0ms
israeli-bank-scrapers:one-zero Fetching access token +523ms
israeli-bank-scrapers:one-zero Getting customer data +1234ms
israeli-bank-scrapers:one-zero Fetching transactions +2345ms
```

The `+XXXms` shows the time elapsed since the last debug message.

## Using Debug in Your Own Code

If you're using the library in your own application, enable debug the same way:

```bash
# In your terminal or .env file
export DEBUG=israeli-bank-scrapers:*

# Then run your app
node your-app.js
```

Or programmatically:

```javascript
// Set before importing the library
process.env.DEBUG = 'israeli-bank-scrapers:*';

const { createScraper, CompanyTypes } = require('israeli-bank-scrapers');
// ... rest of your code
```

## Available Debug Namespaces

The library uses these debug namespaces (based on scraper names):

- `israeli-bank-scrapers:one-zero` - OneZero Bank
- `israeli-bank-scrapers:visa-cal` - Visa CAL
- `israeli-bank-scrapers:max` - Max (Leumi Card)
- `israeli-bank-scrapers:isracard` - Isracard
- `israeli-bank-scrapers:amex` - American Express
- `israeli-bank-scrapers:hapoalim` - Bank Hapoalim
- `israeli-bank-scrapers:leumi` - Bank Leumi
- `israeli-bank-scrapers:discount` - Discount Bank
- `israeli-bank-scrapers:mizrahi` - Mizrahi Tefahot
- And more...

## Debug Patterns

You can use wildcards to enable specific patterns:

```bash
# All israeli-bank-scrapers logs
DEBUG=israeli-bank-scrapers:*

# Only credit card scrapers (if they follow a naming pattern)
DEBUG=israeli-bank-scrapers:*card*

# Multiple specific scrapers
DEBUG=israeli-bank-scrapers:one-zero,israeli-bank-scrapers:leumi
```

## Troubleshooting Common Issues

### 1. Login Failures

```bash
DEBUG=israeli-bank-scrapers:* npm run example:otp
```

Look for errors in the login sequence:
- Authentication requests
- OTP handling
- Token generation
- Session management

### 2. Scraping Issues

Enable debug to see:
- API endpoints being called
- Response data structure
- Transaction parsing
- Date filtering

### 3. Network Issues

```bash
# Enable puppeteer debug too (if using browser-based scrapers)
DEBUG=israeli-bank-scrapers:*,puppeteer:* npm run example:otp
```

## Saving Debug Logs to File

Redirect debug output to a file for later analysis:

```bash
DEBUG=israeli-bank-scrapers:* npm run example:otp 2>&1 | tee debug.log
```

Or save only to file without console output:

```bash
DEBUG=israeli-bank-scrapers:* npm run example:otp 2>&1 > debug.log
```

## Performance Analysis

The `+XXXms` timestamps in debug output help identify slow operations:

```
israeli-bank-scrapers:one-zero Logging in... +0ms
israeli-bank-scrapers:one-zero Fetching token +523ms     ← Fast
israeli-bank-scrapers:one-zero Fetching transactions +5234ms  ← Slow! Investigate
```

## Best Practices

1. **Start Broad**: Use `israeli-bank-scrapers:*` first
2. **Narrow Down**: Switch to specific scraper if needed
3. **Save Logs**: Keep debug logs for recurring issues
4. **Privacy**: Debug logs may contain sensitive data - don't share publicly
5. **Clean Up**: Remove debug flags in production

## Environment Variables in .env File

Create a `.env` file for persistent debug settings:

```bash
# .env
DEBUG=israeli-bank-scrapers:*
BANK_EMAIL=your@email.com
BANK_PASSWORD=yourpass
BANK_PHONE=+972501234567
```

Then use with a package like `dotenv`:

```javascript
require('dotenv').config();
// Debug is now enabled automatically
```

## Additional Resources

- **Debug Package Docs**: https://github.com/debug-js/debug
- **Scraper Verbose Mode**: Use `verbose: true` in scraper options for additional console output
- **Library Issues**: https://github.com/eshaham/israeli-bank-scrapers/issues

## Support

When reporting issues, always include debug logs (with sensitive data removed):

```bash
DEBUG=israeli-bank-scrapers:* npm run example:otp 2>&1 | tee issue-debug.log
# Edit issue-debug.log to remove passwords, account numbers, etc.
# Then share the cleaned log with your issue report
```

---

**Pro Tip**: Combine `DEBUG` with `verbose: true` in the scraper options for maximum visibility:

```typescript
const scraper = createScraper({
  companyId: CompanyTypes.oneZero,
  startDate: new Date(),
  verbose: true,  // ← Additional console logging
});
```

Then run with:
```bash
DEBUG=israeli-bank-scrapers:* npm run example:otp
```


