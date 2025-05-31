import { useState } from 'react';

function App() {
  // ✅ Initialize state with all features
  const [input, setInput] = useState({
    Volume: '0',
    Volume_Lag1: '0',
    Volume_Lag2: '0',
    Volume_Lag3: '0',
    Volume_Ratio: '0',
    Volume_Ratio_Lag1: '0',
    Volume_Ratio_Lag2: '0',
    Volume_Ratio_Lag3: '0',
    High_Low_Ratio: '0',
    High_Low_Ratio_Lag1: '0',
    High_Low_Ratio_Lag2: '0',
    High_Low_Ratio_Lag3: '0',
    cur_weekly_vol: '0',
    weekly_vol_Lag1: '0',
    weekly_vol_Lag2: '0',
    weekly_vol_Lag3: '0',
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
