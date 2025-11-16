'''
Handles lip-sync by controlling the MouthOpen parameter in VTube Studio.
'''
# Import the singleton instance from our unified client
from vtube_client import vts_client

async def lip_sync(enable: bool = True):
    """
    Controls the 'MouthOpen' parameter in VTube Studio for basic lip-sync.
    Uses the unified, async vts_client.
    """
    try:
        value = 1.0 if enable else 0.0
        # Use the new, specific method from the unified client
        await vts_client.set_parameter_value("MouthOpen", value)
    except Exception as e:
        print(f"⚠️ Error al sincronizar labios: {e}")