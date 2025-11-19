import { CompanyTypes, createScraper } from '../src';
import { prompt } from 'enquirer';

/**
 * Example script demonstrating two options for OTP authentication
 * with Israeli Bank Scrapers
 *
 * Usage:
 *   npm run example:otp
 *
 * With debug logging:
 *   DEBUG=israeli-bank-scrapers:* npm run example:otp
 *
 * With credentials:
 *   BANK_EMAIL=user@example.com BANK_PASSWORD=pass BANK_PHONE=+972... npm run example:otp
 */

interface AccountCredentials {
  email: string;
  password: string;
  phoneNumber: string;
  companyId: CompanyTypes;
}

// Configure your account credentials here
const accountConfig: AccountCredentials = {
  email: process.env.BANK_EMAIL || '',
  password: process.env.BANK_PASSWORD || '',
  phoneNumber: process.env.BANK_PHONE || '',
  companyId: CompanyTypes.oneZero, // Change to your bank
};

/**
 * Helper function to prompt user for input
 */
async function askQuestion(message: string): Promise<string> {
  const response = await prompt<{ answer: string }>({
    type: 'input',
    name: 'answer',
    message,
  });
  return response.answer;
}

/**
 * Option 1: Provide OTP callback during scraping
 * This method calls the callback when OTP is needed
 */
async function optionOneCallbackAuth() {
  console.log('\n=== Option 1: OTP Callback Authentication ===\n');

  const scraper = createScraper({
    companyId: accountConfig.companyId,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    verbose: true,
  });

  try {
    // The scrape() method handles both login and data fetching
    const result = await scraper.scrape({
      email: accountConfig.email,
      password: accountConfig.password,
      phoneNumber: accountConfig.phoneNumber,
      otpCodeRetriever: async () => {
        let otpCode = '';
        while (!otpCode) {
          otpCode = await askQuestion('Enter OTP Code: ');
          if (!otpCode) {
            console.log('OTP code is required. Please try again.');
          }
        }
        return otpCode;
      },
    });

    if (result.success) {
      console.log('✅ Login and scraping successful!');
      console.log(`Found ${result.accounts?.length || 0} accounts`);
      result.accounts?.forEach(account => {
        console.log(`  - Account ${account.accountNumber}: ${account.txns.length} transactions`);
      });
    } else {
      console.error('❌ Scraping failed:', result.errorMessage);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Option 2: Retrieve a long-term OTP token (OneZero only)
 * This method gets a token that can be reused for future logins
 */
async function optionTwoLongTermToken() {
  console.log('\n=== Option 2: Long-Term OTP Token (OneZero) ===\n');

  if (accountConfig.companyId !== CompanyTypes.oneZero) {
    console.log('⚠️  Long-term tokens are only supported for OneZero bank');
    return;
  }

  const scraper = createScraper({
    companyId: accountConfig.companyId,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    verbose: true,
  });

  try {
    // Step 1: Trigger two-factor authentication
    console.log('📱 Triggering two-factor authentication...');
    const triggerResult = await scraper.triggerTwoFactorAuth(accountConfig.phoneNumber);

    if (triggerResult.success) {
      console.log('✅ OTP sent to your phone');

      // Step 2: Get OTP code from user
      const otpCode = await askQuestion('Enter the OTP code you received: ');

      // Step 3: Get long-term token
      const tokenResult = await scraper.getLongTermTwoFactorToken(otpCode);

      if (tokenResult.success && 'longTermTwoFactorAuthToken' in tokenResult) {
        console.log('✅ Long-term token retrieved successfully!');
        console.log('\nYour token (save this securely):');
        console.log(tokenResult.longTermTwoFactorAuthToken);
        console.log('\n💡 You can now use this token for future logins without OTP');

        // Demonstrate using the token for scraping
        console.log('\n📝 Now scraping with the token...');
        await scrapeWithToken(tokenResult.longTermTwoFactorAuthToken);
      } else {
        const errorResult = tokenResult as { success: false; errorMessage?: string };
        console.error('❌ Failed to get long-term token:', errorResult.errorMessage || 'Unknown error');
      }
    } else {
      const errorResult = triggerResult as { success: false; errorMessage?: string };
      console.error('❌ Failed to trigger two-factor auth:', errorResult.errorMessage || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example of using a previously obtained long-term token
 */
async function scrapeWithToken(token: string) {
  const scraper = createScraper({
    companyId: accountConfig.companyId,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    verbose: true,
  });

  try {
    const result = await scraper.scrape({
      email: accountConfig.email,
      password: accountConfig.password,
      otpLongTermToken: token,
    });

    if (result.success) {
      console.log('✅ Scraping with token successful!');
      console.log(`Found ${result.accounts?.length || 0} accounts`);
      result.accounts?.forEach(account => {
        console.log(`  - Account ${account.accountNumber}: ${account.txns.length} transactions`);
      });
      console.log('\n💡 You can now scrape without needing OTP each time!');
    } else {
      console.error('❌ Scraping with token failed:', result.errorMessage);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Main menu to select authentication option
 */
async function main() {
  console.log('🏦 Israeli Bank Scrapers - OTP Authentication Examples\n');

  // Validate configuration
  if (!accountConfig.email || !accountConfig.password || !accountConfig.phoneNumber) {
    console.error('❌ Please configure your credentials:');
    console.error('   Set environment variables: BANK_EMAIL, BANK_PASSWORD, BANK_PHONE');
    console.error('   Or edit the accountConfig object in this file');
    process.exit(1);
  }

  const response = await prompt<{ option: string }>({
    type: 'select',
    name: 'option',
    message: 'Choose authentication method:',
    choices: [
      { name: '1', message: 'Option 1: OTP Callback (works with all banks)' },
      { name: '2', message: 'Option 2: Long-term Token (OneZero only)' },
      { name: '3', message: 'Exit' },
    ],
  });

  switch (response.option) {
    case '1':
      await optionOneCallbackAuth();
      break;
    case '2':
      await optionTwoLongTermToken();
      break;
    case '3':
      console.log('👋 Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('Invalid option');
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
