from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def chatgpt_query(prompt, model="gpt-4o-mini"):
    models_to_try = [model, "gpt-3.5-turbo", "gpt-4o-mini", "gpt-4", "text-davinci-003"] 
    
    for current_model in models_to_try:
        try:
            print(f"Intentando con modelo: {current_model}")
            response = client.chat.completions.create(
                model=current_model,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error con modelo {current_model}: {str(e)}")
            continue
    
    return "Error: No se pudo acceder a ningún modelo de ChatGPT. Verifica tu API key y permisos."