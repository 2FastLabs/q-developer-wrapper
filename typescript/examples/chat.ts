import QDeveloperWrapper from '../src/index';
import * as readline from 'readline';

async function main() {
  const q = new QDeveloperWrapper();

  // Check if Q CLI is available
  const available = await q.isAvailable();
  if (!available) {
    console.log('❌ Q CLI not available. Run: q login');
    process.exit(1);
  }
  
  console.log('✅ Q Developer ready! Type /exit to quit\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '🤖 Ask Q: '
  });

  let useTools = false;

  rl.prompt();

  rl.on('line', async (input: string) => {
    const question = input.trim();

    if (question === '/exit') {
      rl.close();
      return;
    }
    if (question === '/tools') {
      useTools = true;
      console.log('🔧 Tools enabled for next question');
      rl.prompt();
      return;
    }
    if (question === '/notool') {
      useTools = false;
      console.log('💭 Tools disabled');
      rl.prompt();
      return;
    }

    if (question) {
      try {
        console.log(`\n${useTools ? '🔧' : '💭'} Q Developer:`);
        
        const response = await q.ask({
          message: question,
          acceptAllTools: useTools,
          timeout: 300000
        });

        if (!response.success) {
          console.log(`❌ Error: ${response.error}`);
        }
        useTools = false; // Reset after each question
      } catch (error) {
        console.log(`❌ Error: ${error}`);
      }
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n👋 Goodbye!');
    process.exit(0);
  });
}

main();
