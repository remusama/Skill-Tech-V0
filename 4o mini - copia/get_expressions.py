
import asyncio
from vtube_client import vts_client

async def main():
    await vts_client.connect()
    if vts_client.is_authenticated:
        expressions = await vts_client.get_expression_list()
        if expressions:
            print("Available Expressions:")
            for exp in expressions:
                print(f"- {exp['name']} (File: {exp['file']})")
        else:
            print("Could not retrieve expressions.")
    await vts_client.close()

if __name__ == "__main__":
    asyncio.run(main())
