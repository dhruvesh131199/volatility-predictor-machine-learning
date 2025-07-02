import React, { useState } from "react";

function DataTable({ data }) {
  if (!data || data.length === 0) return <p>No data available.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          marginBottom: '1rem',
        }}
      >
        <thead>
          <tr>
            {headers.map((key) => (
              <th
                key={key}
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map((key) => (
                <td
                  key={key}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row[key] === null
                    ? '—'
                    : typeof row[key] === 'number'
                    ? row[key].toFixed(4)
                    : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function FetchPredictXgBoost() {
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [predictedVolatility, setPredictedVolatility] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setCurrentStep(0);
    setPredictedVolatility(null);
    setRawData(null);
    setProcessedData(null);

    const delayTimer = setTimeout(() => {
      setShowDelayMessage(true);}, 5000);

    try {
      // STEP 1 — fetch raw data
      setCurrentStep(1);
      const res = await fetch('https://volatility-predictor-api.onrender.com/fetch-and-predict', {
        method: 'POST'
      }); // This should return both raw and processed data
      const data = await res.json();
      console.log("API Response:", data);

      // The API should respond with something like:
      // {
      //   raw: [...],
      //   processed: [...],
      //   predicted_volatility: 0.x
      // }

      setRawData(data.raw);
      setCurrentStep(2);

      // Simulating a small delay to visualize
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessedData(data.processed);
      setCurrentStep(3);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPredictedVolatility(data.predicted_volatility);
      setCurrentStep(4);
    } catch (error) {
      console.error("Parsing error:",error);
    } finally {
      setLoading(false);
      clearTimeout(delayTimer);
      setShowDelayMessage(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Predict With Latest Data</h2>

      <button disabled={loading} onClick={handleClick}>
        {loading ? "Processing…" : "Fetch Data & Predict"}
      </button>

      {/* STEP 1 — Display raw data*/}
      {currentStep >= 1 && rawData && (
        <div style={{ marginBottom: "1rem" }}>
          <h4>Fetched raw data</h4>
          <p>Daily data is fetched from Yahoo finance, and derived weekly parameters<br/ >
          <strong>Volume</strong>: Sum of volume for the week<br/ >
          <strong>cur_weekly_vol</strong>: Standard deviation of each day's volatility</p>
          <DataTable data={rawData} />
        </div>
      )}

      {/* STEP 2 — Display processed data*/}
      {currentStep >= 3 && processedData && (
        <div style={{ marginBottom: "1rem" }}>
          <h4>Processed data</h4>
          <p>Input features to feed XgBoost model. Refer to the Jupyter notebook for more detail.</p>
          <DataTable data={processedData} />
        </div>
      )}

      {/* STEP 4 — Display predicted volatility*/}
      {currentStep === 4 && predictedVolatility !== null && (
      <div className="prediction-box">
        <h4 className="prediction-title">
          Prediction for Next Week's Volatility
        </h4>
        <p className="prediction-value">
          Predicted Volatility: <span>{(predictedVolatility * 100).toFixed(5)}%</span>
        </p>
      </div>
)}

      {/* Loading indicator or progress*/}
      {loading && <p>Processing...</p>}

      {loading && showDelayMessage && (
        <p style={{marginTop: '0.5rem', fontStyle: 'italic' }}>
        It may take some time to load the first time due to using the free version on render. Please wait...
        </p>
      )}
    </div>
  );
}

export default FetchPredictXgBoost;
