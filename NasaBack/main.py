from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.prediction.prediction_controller import prediction_router
from src.chat.chat_controller import chat_router
from src.csv.csv_controller import csv_router

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router, prefix="/predict", tags=["Predict"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(csv_router, prefix="/csv", tags=["CSV"])

