import React, { useState } from 'react';
import "./CropSuggest.css";
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import ReactMarkdown from 'react-markdown';
import Footer from "../Home/Footer/Footer";

function CropSuggest() {
  const [form, setForm] = useState({
    soilType: '',
    climate: '',
    rainfall: '',
    temperature: '',
    farmingGoal: '', // Add this line
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuggestion('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/suggest-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }

      const result = await response.json();
      setSuggestion(result.suggestion);
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className="main-app-container">
        <Navi />
        <div className="crop-suggest-container">
          <h1>AI Crop Suggester</h1>
          <p>Enter your environmental conditions and get a smart crop suggestion from Google's Gemini AI.</p>
          <form id="crop-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="soilType">Soil Type</label>
              <input
                type="text"
                id="soilType"
                name="soilType"
                placeholder="e.g., Clay, Sandy, Loamy"
                value={form.soilType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="climate">Climate</label>
              <input
                type="text"
                id="climate"
                name="climate"
                placeholder="e.g., Tropical, Temperate, Arid"
                value={form.climate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="rainfall">Average Annual Rainfall (mm)</label>
              <input
                type="number"
                id="rainfall"
                name="rainfall"
                placeholder="e.g., 1200"
                value={form.rainfall}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="temperature">Average Temperature (°C)</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                placeholder="e.g., 25"
                value={form.temperature}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="farmingGoal">Farming Goal</label>
              <select
                id="farmingGoal"
                name="farmingGoal"
                value={form.farmingGoal}
                onChange={handleChange}
                required
              >
                <option value="">Select a goal</option>
                <option value="Maximum Yield">Maximum Yield</option>
                <option value="High Market Value">High Market Value</option>
                <option value="Low Maintenance">Low Maintenance</option>
                <option value="Improve Soil Health">Improve Soil Health</option>
              </select>
            </div>
            <button type="submit" id="submit-btn" disabled={loading}>
              {loading ? "Generating..." : "Get Crop Suggestion"}
            </button>
          </form>
          {loading && <div className="text-center">Generating suggestion...</div>}
          {error && <div className="text-center error">{error}</div>}
          {suggestion && (
            <div className="suggestion-container">
              <h2 className="suggestion-title">Suggested Crops:</h2>
                <div className="crop-suggest-hero-image"></div>

              <div className="suggestion-content"><ReactMarkdown>{suggestion}</ReactMarkdown></div>
            </div>
          )}
        </div>
      </div>
      <Footer /> 
    </div>
  );
}

export default CropSuggest;