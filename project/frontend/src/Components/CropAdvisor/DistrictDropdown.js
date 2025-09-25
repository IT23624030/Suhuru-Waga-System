import React, { useEffect, useState } from "react";
import axios from "axios";

// Centralized API client (same base as in CropAdvisor)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

function DistrictDropdown({ onSelect, selectedValue }) {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await api.get("/districts");
        setDistricts(res.data);

        // If no district is selected, set first district as default
        if (!selectedValue && res.data.length > 0 && typeof onSelect === "function") {
          onSelect(""); // keep placeholder selected initially
        }
      } catch (err) {
        console.error("Error fetching districts:", err?.message, err?.response?.data);
        const message = err?.response?.data?.message || err?.message || "Could not fetch districts. Please check the backend connection.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, [onSelect, selectedValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (typeof onSelect === "function") {
      onSelect(value);
    }
  };

  if (loading) {
    return <div>Loading districts...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (districts.length === 0) {
    return <div>No districts found. Please add some crops to the database.</div>;
  }

  return (
    <select value={selectedValue} onChange={handleChange}>
      {/* Placeholder option */}
      <option value="" disabled>
        -- Select a District --
      </option>

      {/* District options */}
      {districts.map((d, index) => (
        <option key={index} value={d}>
          {d}
        </option>
      ))}
    </select>
  );
}

export default DistrictDropdown;
