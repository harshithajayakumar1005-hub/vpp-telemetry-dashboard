import time
import random
import requests

API_URL = "http://localhost:8000/api/telemetry"

def generate_vpp_data():
    soc = 50.0
    while True:
        load = round(random.uniform(1.0, 10.0), 2)
        solar = round(random.uniform(0.0, 8.0), 2)
        
        net_power = solar - load
        soc += net_power * 0.1
        soc = max(0.0, min(100.0, soc))
        
        data = {
            "load": load,
            "solar": solar,
            "soc": round(soc, 2)
        }
        
        try:
            response = requests.post(API_URL, json=data)
            print(f"[Pushed to Cloud API] -> {data} | Status: {response.status_code}")
        except Exception as e:
            print(f"Error pushing data: {e}")
            
        time.sleep(1)

if __name__ == "__main__":
    generate_vpp_data()