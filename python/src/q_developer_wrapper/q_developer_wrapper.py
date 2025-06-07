import sys
import asyncio
from typing import Optional
from dataclasses import dataclass

@dataclass
class QRequest:
    """Request to Q Developer"""
    message: str
    accept_all_tools: bool = False
    timeout: int = 120000  # 2 minutes default


@dataclass
class QResponse:
    """Response from Q Developer"""
    success: bool
    content: str
    error: Optional[str] = None


class QDeveloperWrapper:
    """
    Python wrapper for Q Developer CLI
    """
    def __init__(self, q_cli_path: str = 'q'):
        """
        Initialize with path to Q CLI executable
        """
        self.q_cli_path = q_cli_path

    async def ask(self, request: QRequest) -> QResponse:
        """
        Send a request to Q Developer and get response
        """
        args = [self.q_cli_path, 'chat', '--no-interactive']

        if request.accept_all_tools:
            args.append('--accept-all')

        print(f"Executing: {self.q_cli_path} {' '.join(args)}")

        try:
            # Create the subprocess
            process = await asyncio.create_subprocess_exec(
                *args,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            # Send the message via stdin
            if process.stdin:
                process.stdin.write(request.message.encode())
                await process.stdin.drain()
                process.stdin.close()

            stdout = ''
            stderr = ''

            # Handle timeout
            timeout_task = None
            if request.timeout > 0:
                timeout_task = asyncio.create_task(asyncio.sleep(request.timeout / 1000))  # Convert ms to seconds

            # Process output until completion or timeout
            reading_task = asyncio.create_task(self._read_output(process))

            done, pending = await asyncio.wait(
                [reading_task] + ([timeout_task] if timeout_task else []),
                return_when=asyncio.FIRST_COMPLETED
            )

            if timeout_task and timeout_task in done:
                # Timeout occurred
                reading_task.cancel()
                if process.returncode is None:
                    process.terminate()  # Try to terminate gracefully
                    try:
                        await asyncio.wait_for(process.wait(), timeout=5)  # Wait up to 5 seconds
                    except asyncio.TimeoutError:
                        process.kill()  # Force kill if still running

                print("\n[TIMEOUT]")
                return QResponse(
                    success=False,
                    content=stdout,
                    error="Timeout"
                )
            else:
                # Process completed
                if timeout_task:
                    timeout_task.cancel()

                stdout, stderr = await reading_task

                # Wait for process to complete and get return code
                return_code = await process.wait()

                print()  # New line after streaming output
                return QResponse(
                    success=return_code == 0,
                    content=stdout.strip(),
                    error=stderr.strip() or "Command failed" if return_code != 0 else None
                )

        except Exception as e:
            return QResponse(
                success=False,
                content='',
                error=str(e)
            )

    async def _read_output(self, process):
        """Helper method to read process stdout and stderr while displaying stdout"""
        stdout = ''
        stderr = ''

        while True:
            line = await process.stdout.readline()
            if not line:
                break

            line_str = line.decode()
            stdout += line_str
            # Display streaming chunks immediately
            sys.stdout.write(line_str)
            sys.stdout.flush()

        # Read remaining stderr
        stderr = (await process.stderr.read()).decode()

        return stdout, stderr

    async def chat(self, message: str) -> str:
        """
        Quick helper - ask without tools
        """
        response = await self.ask(QRequest(message=message))
        if not response.success:
            raise Exception(response.error or "Q Developer request failed")
        return response.content

    async def execute(self, message: str) -> str:
        """
        Quick helper - ask with tools enabled
        """
        response = await self.ask(QRequest(
            message=message,
            accept_all_tools=True
        ))
        if not response.success:
            raise Exception(response.error or "Q Developer request failed")
        return response.content

    async def is_available(self) -> bool:
        """
        Check if Q CLI is available
        """
        try:
            response = await self.ask(QRequest(
                message="hello",
                timeout=60000  # 1 minute for availability check
            ))
            return response.success
        except Exception:
            return False
