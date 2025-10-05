import requests

response = requests.post("http://127.0.0.1:8000/chord/predict/", json={
    "time": {"dia": 10, "mes": 4, "hora": "15:30"},
    "location": {"latitud": 40.4168, "longitud": -3.7038}
})

print(response.status_code)
print(response.json())
