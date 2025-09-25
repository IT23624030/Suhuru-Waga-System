import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Calculator.css"; 

function VegetableDropdown({ onSelect, selectedValue }) {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        const res = await axios.get("http://localhost:5000/market");
        setVegetables(res.data);

        if (!selectedValue && typeof onSelect === "function") {
          onSelect(""); // placeholder selected initially
        }
      } catch (err) {
        console.error("Error fetching vegetables:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVegetables();
  }, [onSelect, selectedValue]);

  const handleChange = (e) => {
    if (typeof onSelect === "function") {
      onSelect(e.target.value);
    }
  };

  if (loading) return <div>Loading vegetables...</div>;
  if (error) return <div style={{ color: "red" }}>Error: Could not fetch vegetables.</div>;
  if (vegetables.length === 0) return <div>No vegetables found. Please add some to the database.</div>;

  return (
    <select value={selectedValue} onChange={handleChange}>
      {/* Placeholder option */}
      <option value="" className="placeholder" disabled>
        -- Search crop --
      </option>

      {/* Vegetable options */}
      {vegetables.map((v) => (
        <option key={v._id || v.vegname} value={v.vegname}>
          {v.vegname}
        </option>
      ))}
    </select>
  );
}

export default VegetableDropdown;
