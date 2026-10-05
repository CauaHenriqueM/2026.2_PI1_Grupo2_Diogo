from pydantic import BaseModel

class Metrics(BaseModel):
    speed: float        # cm/s
    rpm: float
    battery: float      # 0–100 (%)