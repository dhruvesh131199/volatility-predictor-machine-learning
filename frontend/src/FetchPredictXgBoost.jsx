import React, { useState } from "react";

function DataTable({ data }) {
  if (!data || data.length === 0) return <p>No data available.</p>;

  const headers = Object.keys(data[0]);

  return (
    <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "1rem" }}>
      <thead>
        <tr>
          {headers.map((key) => (
            <th key={key} style={{ border: "1px solid #ccc", padding: "8px", background: "#f0f0f0" }}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {headers.map((key) => (
              <td key={key} style={{ border: "1px solid #ddd", padding: "8px" }}>
                {row[key] === null ? "—" : typeof row[key] === "number" ? row[key].toFixed(4) : row[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


function FetchPredictXgBoost() {
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [predictedVolatility, setPredictedVolatility] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleClick = async () => {
    setLoading(true);
    setCurrentStep(0);
    setPredictedVolatility(null);
    setRawData(null);
    setProcessedData(null);

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
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Analyze Stock Volatility</h2>

      <button disabled={loading} onClick={handleClick}>
        {loading ? "Processing…" : "Analyze"}
      </button>

      {/* STEP 1 — Display raw data*/}
      {currentStep >= 1 && rawData && (
        <div style={{ marginBottom: "1rem" }}>
          <h4>Step 1 — Fetched raw data</h4>
          <DataTable data={rawData} />
        </div>
      )}

      {/* STEP 2 — Display processed data*/}
      {currentStep >= 3 && processedData && (
        <div style={{ marginBottom: "1rem" }}>
          <h4>Step 2 — Processed data</h4>
          <DataTable data={processedData} />
        </div>
      )}

      {/* STEP 4 — Display predicted volatility*/}
      {currentStep == 4 && predictedVolatility !== null && (
        <div style={{ marginBottom: "1rem" }}>
          <h4>Step 4 — Model's predicted volatility</h4>
          <p>Predicted Volatility: {(predictedVolatility*100).toFixed(5)}%</p>
        </div>
      )}

      {/* Loading indicator or progress*/}
      {loading && <p>Processing...</p>}

      {/* An optional small animation or progress bar can be placed here*/}
    </div>
  );
}

export default FetchPredictXgBoost;
