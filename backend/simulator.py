import time
import random
import requests

API_URL = "https://vpp-telemetry-dashboard.onrender.com/api/telemetry"

def generate_vpp_data():
    soc = 65.0  # Start with a healthy battery percentage
    while True:
        load = round(random.uniform(2.0, 8.0), 2)
        solar = round(random.uniform(1.0, 7.0), 2)
        
        # Smoothly fluctuate SOC for a realistic demo range (between 30% and 90%)
        soc += random.uniform(-2.5, 2.5)
        soc = max(30.0, min(90.0, soc))
        
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