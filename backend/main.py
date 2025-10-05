from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.prediction.prediction_controller import prediction_router

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router, prefix="/weather", tags=["Weather"])

