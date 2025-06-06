import { spawn } from 'child_process';

export interface QRequest {
  message: string;
  acceptAllTools?: boolean;
  timeout?: number;
}

export interface QResponse {
  success: boolean;
  content: string;
  error?: string;
}

export class QDeveloperWrapper {
  private qCliPath: string;

  constructor(qCliPath: string = 'q') {
    this.qCliPath = qCliPath;
  }

  /**
   * Send a request to Q Developer and get response
   */
  async ask(request: QRequest): Promise<QResponse> {
    return new Promise((resolve) => {
      const args = ['chat', '--no-interactive'];
      
      if (request.acceptAllTools) {
        args.push('--accept-all');
      }

      console.log('Executing:', this.qCliPath, args.join(' '));

      const child = spawn(this.qCliPath, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Send the message via stdin
      child.stdin?.write(request.message);
      child.stdin?.end();

      let stdout = '';
      let stderr = '';
      let resolved = false;

      child.stdout?.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        // Display streaming chunks immediately
        process.stdout.write(chunk);
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (!resolved) {
          resolved = true;
          console.log(); // New line after streaming output
          resolve({
            success: code === 0,
            content: stdout.trim(),
            error: code !== 0 ? stderr.trim() || 'Command failed' : undefined,
          });
        }
      });

      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          resolve({
            success: false,
            content: '',
            error: error.message,
          });
        }
      });

      // Increased timeout to 2 minutes (or disable entirely)
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill();
          console.log('\n[TIMEOUT]');
          resolve({
            success: false,
            content: stdout.trim() || '',
            error: 'Timeout',
          });
        }
      }, request.timeout || 120000); // 2 minutes default
    });
  }

  /**
   * Quick helper - ask without tools
   */
  async chat(message: string): Promise<string> {
    const response = await this.ask({ message });
    if (!response.success) {
      throw new Error(response.error || 'Q Developer request failed');
    }
    return response.content;
  }

  /**
   * Quick helper - ask with tools enabled
   */
  async execute(message: string): Promise<string> {
    const response = await this.ask({ 
      message, 
      acceptAllTools: true 
    });
    if (!response.success) {
      throw new Error(response.error || 'Q Developer request failed');
    }
    return response.content;
  }

  /**
   * Check if Q CLI is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.ask({ 
        message: 'hello', 
        timeout: 60000  // 1 minute for availability check
      });
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

// Export for easy import
export default QDeveloperWrapper;
