# Q Developer Wrapper for Python

A Python wrapper for interacting with the Q Developer CLI.

## Installation

### From Source

Clone the repository and install the package:

```bash
git clone [repository-url]
cd q-developer-wrapper/python
pip install -e .
```

## Usage

### Basic Examples

```python
import asyncio
from q_developer_wrapper import QDeveloperWrapper, QRequest, QResponse

async def simple_example():
    # Initialize wrapper with default 'q' CLI path
    q = QDeveloperWrapper()

    # Check if Q CLI is available
    if not await q.is_available():
        print("Q Developer CLI is not available")
        return

    # Simple chat without tools
    try:
        response = await q.chat("What is the capital of France?")
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {e}")

    # Execute with tools enabled
    try:
        response = await q.execute("Show me the weather in Paris")
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {e}")

# Run the example
asyncio.run(simple_example())
```

### Advanced Configuration

```python
import asyncio
from q_developer_wrapper import QDeveloperWrapper, QRequest

async def advanced_example():
    # Use a custom path to the Q CLI executable
    q = QDeveloperWrapper(q_cli_path="/usr/local/bin/q")

    # Create a custom request
    request = QRequest(
        message="Write a Python class to manage user data",
        accept_all_tools=True,
        timeout=180000  # 3 minutes timeout
    )

    # Send the request
    response = await q.ask(request)

    if response.success:
        print(f"Q Developer Response:\n{response.content}")
    else:
        print(f"Error: {response.error}")

asyncio.run(advanced_example())
```

## API Reference

### QRequest

```python
@dataclass
class QRequest:
    message: str               # The message to send to Q Developer
    accept_all_tools: bool = False  # Whether to accept all tools
    timeout: int = 120000      # Timeout in milliseconds (default: 2 minutes)
```

### QResponse

```python
@dataclass
class QResponse:
    success: bool              # Whether the request was successful
    content: str               # The response content
    error: Optional[str] = None  # Error message if any
```

### QDeveloperWrapper

```python
class QDeveloperWrapper:
    def __init__(self, q_cli_path: str = 'q')

    async def ask(self, request: QRequest) -> QResponse:
        # Send a request to Q Developer and get response

    async def chat(self, message: str) -> str:
        # Quick helper - ask without tools

    async def execute(self, message: str) -> str:
        # Quick helper - ask with tools enabled

    async def is_available(self) -> bool:
        # Check if Q CLI is available
```

## Requirements

- Python 3.7+
- Q Developer CLI installed and accessible in PATH

## Differences from TypeScript Implementation

The Python implementation offers the same functionality as the TypeScript version with these implementation differences:

1. Uses Python's `asyncio` for asynchronous operations instead of JavaScript Promises
2. Uses Python dataclasses instead of TypeScript interfaces
3. The Python version handles subprocess management using `asyncio.create_subprocess_exec`
4. Error handling and timeout mechanisms are adapted to Python's async patterns
