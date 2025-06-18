from pydantic import BaseModel

class InputFeatures(BaseModel):
    volume: int
    volume_lag1: float
    volume_lag2: float
    volume_lag3: float
    volume_ratio: float
    volume_ratio_lag1: float
    volume_ratio_lag2: float
    volume_ratio_lag3: float
    high_low_ratio: float
    high_low_ratio_lag1: float
    high_low_ratio_lag2: float
    high_low_ratio_lag3: float
    cur_weekly_vol: float
    weekly_vol_lag1: float
    weekly_vol_lag2: float
    weekly_vol_lag3: float