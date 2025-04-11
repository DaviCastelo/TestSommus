import pandas as pd
import requests
from typing import Optional, Dict, Union
from datetime import datetime

class InfoDengueClient:
    BASE_URL = "https://info.dengue.mat.br/api/alertcity"
    
    def __init__(self):
        self.session = requests.Session()
    
    def get_dengue_data(
        self,
        geocode: int,
        disease: str = "dengue",
        format: str = "csv",
        ew_start: int = 1,
        ew_end: int = 53,
        ey_start: int = datetime.now().year,
        ey_end: int = datetime.now().year
    ) -> Union[pd.DataFrame, Dict]:
        """
        Fetch dengue data from InfoDengue API
        
        Args:
            geocode (int): IBGE city code
            disease (str): Type of disease (dengue|chikungunya|zika)
            format (str): Output format (json|csv)
            ew_start (int): Start epidemiological week (1-53)
            ew_end (int): End epidemiological week (1-53)
            ey_start (int): Start year
            ey_end (int): End year
            
        Returns:
            Union[pd.DataFrame, Dict]: Data in the requested format
        """
        params = {
            "geocode": geocode,
            "disease": disease,
            "format": format,
            "ew_start": ew_start,
            "ew_end": ew_end,
            "ey_start": ey_start,
            "ey_end": ey_end
        }
        
        response = self.session.get(self.BASE_URL, params=params)
        response.raise_for_status()
        
        if format == "csv":
            return pd.read_csv(response.url)
        else:
            return response.json()

# Example usage
if __name__ == "__main__":
    client = InfoDengueClient()
    
    try:
        df = client.get_dengue_data(
            geocode=3304557,
            disease="dengue",
            format="csv",
            ew_start=1,
            ew_end=50,
            ey_start=2023,
            ey_end=2023
        )
        print("Data fetched successfully!")
        print("\nFirst 5 rows of data:")
        print(df.head())
    except Exception as e:
        print(f"Error fetching data: {e}") 