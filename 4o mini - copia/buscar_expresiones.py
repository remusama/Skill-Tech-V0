
'''
Script to find specific expressions in VTube Studio based on keywords.
'''
import asyncio
from vtube_client import vts_client

# Keywords to search for in expression file names. Case-insensitive.
KEYWORDS = ["atenta", "atento", "listen", "escuchando", "neutral", "default"]

async def main():
    """
    Connects to VTube Studio, gets all expressions, and filters them
    to find ones related to being "attentive".
    """
    print("🔍 Buscando expresiones de 'atención' en VTube Studio...")
    
    expressions = await vts_client.get_expression_list()

    if expressions:
        print("\n✅ Lista de expresiones obtenida. Filtrando por palabras clave...")
        
        found_expressions = []
        for exp in expressions:
            # The expression file name is what we need to activate it.
            exp_file_name = exp.get('file', '')
            # Search for keywords in a case-insensitive way.
            if any(keyword in exp_file_name.lower() for keyword in KEYWORDS):
                found_expressions.append(exp_file_name)

        if found_expressions:
            print("\n✨ Posibles expresiones de 'atención' encontradas:")
            print("--------------------------------------------------")
            for name in found_expressions:
                # The name to be used in the command is the file name without the extension.
                clean_name = name.replace('.exp3.json', '')
                print(f"- {clean_name}")
            print("--------------------------------------------------")
            print("\nUsa uno de estos nombres en el prompt de Eleonor, dentro de [EXPRESION:...]")
        else:
            print("\n🟡 No se encontró ninguna expresión que coincida con las palabras clave.")
            print("   Palabras clave buscadas:", KEYWORDS)
            print("   Asegúrate de que los nombres de tus archivos de expresión en VTube Studio contengan alguna de estas palabras.")

    else:
        print("\n❌ No se pudo obtener la lista de expresiones. Revisa los mensajes de error.")
        print("   Asegúrate de que VTube Studio esté abierto, que un modelo esté cargado y que hayas autenticado el plugin.")

    # Cleanly close the connection
    await vts_client.close()

if __name__ == "__main__":
    print("--- Buscador de Expresiones de VTube Studio ---")
    asyncio.run(main())
    print("---------------------------------------------")
