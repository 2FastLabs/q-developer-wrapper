# Q Developer Wrapper for TypeScript/JavaScript

A TypeScript/JavaScript wrapper for interacting with the Q Developer CLI.

## Installation

```bash
npm install q-developer-wrapper
```

For TypeScript development, also install:
```bash
npm install -D typescript @types/node ts-node
```

## Usage

### Basic Examples

```typescript
import QDeveloperWrapper from 'q-developer-wrapper';

const q = new QDeveloperWrapper();

// Simple chat (no tools)
const answer = await q.chat('What are TypeScript best practices?');
console.log(answer);

// Execute with tools enabled (can create/modify files)
const code = await q.execute('Create a function to validate emails');
console.log(code);

// Full control
const response = await q.ask({
  message: 'Help me debug this code',
  acceptAllTools: true,
  timeout: 60000
});

if (response.success) {
  console.log(response.content);
} else {
  console.error(response.error);
}
```

### Interactive Chat Example

See the complete interactive chat example at [`examples/chat.ts`](examples/chat.ts).

**Quick start:**
```bash
# Option 1: Install ts-node globally (one time)
npm install -g ts-node
ts-node examples/chat.ts

# Option 2: Use local installation
npm install -D typescript @types/node ts-node
npx ts-node examples/chat.ts
```

Features:
- Interactive question/answer loop
- `/tools` - Enable tools for next question  
- `/notool` - Disable tools
- `/exit` - Exit session
- Real-time streaming responses

## API Reference

### Methods

**`ask(request: QRequest): Promise<QResponse>`**
- `request.message`: Your prompt
- `request.acceptAllTools`: Enable tool execution (default: false)  
- `request.timeout`: Timeout in ms (default: 120000)

**`chat(message: string): Promise<string>`**
- Simple chat without tools, throws on error

**`execute(message: string): Promise<string>`**  
- Chat with tools enabled, throws on error

**`isAvailable(): Promise<boolean>`**
- Check if Q CLI is available and authenticated

### Types

```typescript
interface QRequest {
  message: string;
  acceptAllTools?: boolean;
  timeout?: number;
}

interface QResponse {
  success: boolean;
  content: string;
  error?: string;
}
```

## How It Works

Uses `q chat --no-interactive` with stdin input:
- Sends messages via stdin (like `echo "message" | q chat --no-interactive`)
- Tools run with `--trust-all-tools` flag when enabled
- Real-time streaming output
- Clean, programmatic interface

Perfect for automation, CI/CD, and interactive applications.

## Requirements

- Node.js 14+
- Q Developer CLI installed and accessible in PATH

## Authors

- [Corneliu Croitoru](https://www.linkedin.com/in/corneliucroitoru/)
- [Anthony Bernabeu](https://www.linkedin.com/in/anthonybernabeu/)
