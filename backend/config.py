from dotenv import load_dotenv
import os

load_dotenv()  # carga variables del archivo .env

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")