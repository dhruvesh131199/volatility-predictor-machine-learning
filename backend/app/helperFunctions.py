import yfinance as yf
import pandas as pd
import numpy as np

def fetchandcleanXGboost(days = 4, symbol = "RELIANCE.NS"):
	#Simply fetch the the last 42 days(6weeks) of data, then
	#will pick the previous 3 weeks based on the thursday

	raw_df = yf.download(symbol, period = "42d")
	raw_df.columns = [col[0] for col in raw_df.columns]
	#raw_df = pd.read_csv("raw_df.csv")
	#raw_df["Date"] = pd.to_datetime(raw_df["Date"])
	#raw_df = raw_df.set_index("Date")
	raw_df["daily_vol"] = (raw_df["Close"]/raw_df["Close"].shift(1)).apply(np.log)

	raw_weekly_df = raw_df.resample("W-THU").agg({
		"Open": "first",
		"High": "max",
		"Low": "min",
		"Close": "last",
		"Volume": "sum",
		"daily_vol": "std"
		})

	raw_weekly_df = raw_weekly_df.rename(columns={'daily_vol': 'cur_weekly_vol'})

	#check if the last day of the raw_df is thursday or not?
	#if it is thursday, we have a complete week, to predict next week's volatility
	#So we only keep the last three weeks

	#if it is not a thursday, then we don't keep the last record of weekly_df since it is not a complete week
	#We remove the last record, then keep the last three records(weeks) for the prediction

	is_thursday = raw_df.index[-1].weekday() == 3
	if is_thursday:
		raw_weekly_df = raw_weekly_df.tail(5)
	else:
		raw_weekly_df = raw_weekly_df[:-1].tail(5)

	raw_df.to_csv("raw_df.csv")

	#Add required features
	weekly_df = raw_weekly_df.copy()
	weekly_df["high_low_ratio"] = weekly_df["High"]/weekly_df["Low"]
	weekly_df["volume_ratio"] = weekly_df["Volume"]/weekly_df["Volume"].shift(1)

	for i in range(1,4):
		weekly_df[f"volume_ratio_lag{i}"] = weekly_df["volume_ratio"].shift(i)
		weekly_df[f"volume_lag{i}"] = weekly_df["Volume"].shift(i)
		weekly_df[f"high_low_ratio_lag{i}"] = weekly_df["high_low_ratio"].shift(i)
		weekly_df[f"weekly_vol_Lag{i}"] = weekly_df["cur_weekly_vol"].shift(i)

	weekly_df = weekly_df.drop(columns = ["Open", "High", "Low", "Close"])
	weekly_df.columns = weekly_df.columns.str.lower()

	weekly_df = weekly_df[["volume", "volume_lag1", "volume_lag2", "volume_lag3","volume_ratio", "volume_ratio_lag1", "volume_ratio_lag2", "volume_ratio_lag3","high_low_ratio", "high_low_ratio_lag1", "high_low_ratio_lag2", "high_low_ratio_lag3","cur_weekly_vol", "weekly_vol_lag1", "weekly_vol_lag2", "weekly_vol_lag3"]]

	return [raw_weekly_df, weekly_df]