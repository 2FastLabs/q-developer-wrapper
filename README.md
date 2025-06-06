# Q Developer Wrapper

A lightweight SDK wrapper library for Amazon Q Developer CLI that enables seamless integration of AI capabilities into your applications, scripts, and automation workflows.

This library allows developers to programmatically interact with Amazon Q Developer, making it easy to build AI-powered features, automate code generation, create intelligent assistants, and enhance developer productivity tools - all while leveraging Amazon Q's advanced capabilities.

## 🔖 Features

- 🔄 **Simple API** — Clean, promise-based interface for interacting with Amazon Q Developer CLI
- 🌊 **Streaming Output** — Real-time streaming of responses as they're generated
- 🔤 **Dual language support** — Fully implemented in TypeScript, with Python implementation coming soon
- 🧩 **Flexible Integration** — Easy to integrate into any Node.js application or script
- 🛠️ **Interactive CLI** — Ready-to-use interactive command-line interface included
- 🌐 **Cross-platform** — Works on any platform where Amazon Q Developer CLI is available

## Prerequisites

1. **Install Amazon Q Developer CLI** from [AWS Q Developer](https://aws.amazon.com/q/developer/)
2. **Authenticate**: Run `q login` 
3. **Verify**: Run `q chat --no-interactive "hello"`

## Installation

```bash
npm install q-developer-wrapper
```

For TypeScript development, also install:
```bash
npm install -D typescript @types/node ts-node
```

## Basic Usage

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

## Interactive Chat

For a complete interactive chat session, see the example file:

```typescript
// Basic usage
const q = new QDeveloperWrapper();
const answer = await q.chat('What are TypeScript best practices?');
console.log(answer);
```

**📁 Complete interactive chat examples:**
- TypeScript: [`typescript/examples/chat.ts`](typescript/examples/chat.ts)  
- JavaScript: Coming soon

**Quick start (TypeScript):**
```bash
# Option 1: Install ts-node globally (one time)
npm install -g ts-node
ts-node typescript/examples/chat.ts

# Option 2: Use local installation
npm install -D typescript @types/node ts-node
npx ts-node typescript/examples/chat.ts
```

**If you get "command not found: ts-node":**
- Install ts-node first: `npm install -g ts-node`

Features:
- Interactive question/answer loop
- `/tools` - Enable tools for next question  
- `/notool` - Disable tools
- `/exit` - Exit session
- Real-time streaming responses

## API

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
- Tools run with `--accept-all` flag when enabled
- Real-time streaming output
- Clean, programmatic interface

Perfect for automation, CI/CD, and interactive applications.

## Language Implementations

- [TypeScript](typescript/) - Complete implementation
- [Python](python/) - Coming soon
