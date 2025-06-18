import { useState } from 'react';
import FetchPredictXgBoost from './FetchPredictXgBoost';

function App() {
  // ✅ Initialize state with all features
  const [input, setInput] = useState({
    volume: '0',
    volume_lag1: '0',
    volume_lag2: '0',
    volume_lag3: '0',
    volume_ratio: '0',
    volume_ratio_lag1: '0',
    volume_ratio_lag2: '0',
    volume_ratio_lag3: '0',
    high_low_ratio: '0',
    high_low_ratio_lag1: '0',
    high_low_ratio_lag2: '0',
    high_low_ratio_lag3: '0',
    cur_weekly_vol: '0',
    weekly_vol_lag1: '0',
    weekly_vol_lag2: '100',
    weekly_vol_lag3: '100'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {};
      for (const key in input) {
        payload[key] = parseFloat(input[key]); // Convert to number
      }

      const res = await fetch('https://volatility-predictor-api.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data.predicted_volatility);
    } catch (err) {
      console.error(err);
      setResult("Error fetching prediction.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📈 Stock Volatility Predictor</h2>

      <div>
        <h3>Analyze with automated data</h3>
        <FetchPredictXgBoost />
      </div>

      <h3>Manually Predict with form</h3>

      <form onSubmit={handleSubmit}>
        {Object.keys(input).map((key) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>{key}:</label>
            <input
              type="number"
              name={key}
              value={input[key]}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              step="any"
            />
          </div>
        ))}

        <button type="submit" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          Predict
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {result !== null && !loading && (
        <p style={{ marginTop: '1rem' }}>
          📊 <strong>Predicted Volatility:</strong> {result}
        </p>
      )}
    </div>


  );
}

export default App;
