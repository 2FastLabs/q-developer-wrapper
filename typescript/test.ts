import QDeveloperWrapper from './src/index';

async function main() {
  const q = new QDeveloperWrapper();

  // Check if Q CLI is available
  const available = await q.isAvailable();
  console.log('Q CLI available:', available);

  if (!available) {
    console.log('Make sure Q CLI is installed and you are logged in');
    return;
  }

  try {
    // Simple chat
    console.log('\n=== Simple Chat ===');
    const response1 = await q.chat('What are the best practices for TypeScript?');
    console.log(response1);

    // Chat with tools enabled
    console.log('\n=== With Tools ===');
    const response2 = await q.execute('Create a simple TypeScript function to validate email addresses');
    console.log(response2);

    // Manual request with full control
    console.log('\n=== Manual Request ===');
    const response3 = await q.ask({
      message: 'Explain how async/await works in JavaScript',
      acceptAllTools: false,
      timeout: 30000
    });
    
    if (response3.success) {
      console.log(response3.content);
    } else {
      console.error('Error:', response3.error);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();
