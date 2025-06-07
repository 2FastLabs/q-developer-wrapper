import asyncio
from q_developer_wrapper import QDeveloperWrapper, QRequest


async def main():
    # Initialize the wrapper
    q = QDeveloperWrapper()  # Uses 'q' as default path

    # Check if Q CLI is available
    is_available = await q.is_available()
    print(f"Q CLI available: {is_available}")
    if not is_available:
        print("Q Developer CLI is not available. Please install it and make sure it's in your PATH.")
        return

    # Simple chat without tools
    print("\n--- Simple Chat Example ---")
    try:
        response = await q.chat("What is the capital of France?")
        print(f"Chat response:\n{response}")
    except Exception as e:
        print(f"Chat error: {e}")

    # Execute with tools enabled
    print("\n--- Execute with Tools Example ---")
    try:
        response = await q.execute("What is the weather in Paris?")
        print(f"Execute response:\n{response}")
    except Exception as e:
        print(f"Execute error: {e}")

    # Advanced usage with customized request
    print("\n--- Advanced Usage Example ---")
    try:
        request = QRequest(
            message="Write a python function to calculate fibonacci numbers",
            accept_all_tools=True,
            timeout=60000  # 1 minute timeout
        )
        response = await q.ask(request)
        if response.success:
            print(f"Advanced response:\n{response.content}")
        else:
            print(f"Advanced error: {response.error}")
    except Exception as e:
        print(f"Advanced request error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
