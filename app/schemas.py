from pydantic import BaseModel

class InputFeatures(BaseModel):
    Volume: int
    Volume_Lag1: float
    Volume_Lag2: float
    Volume_Lag3: float
    Volume_Ratio: float
    Volume_Ratio_Lag1: float
    Volume_Ratio_Lag2: float
    Volume_Ratio_Lag3: float
    High_Low_Ratio: float
    High_Low_Ratio_Lag1: float
    High_Low_Ratio_Lag2: float
    High_Low_Ratio_Lag3: float
    cur_weekly_vol: float
    weekly_vol_Lag1: float
    weekly_vol_Lag2: float
    weekly_vol_Lag3: float