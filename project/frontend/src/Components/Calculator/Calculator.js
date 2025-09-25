import React, { useEffect,useState } from "react";
import axios from "axios";
import VegetableDropdown from "./VegetableDropdown"; 
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import "./Calculator.css";
import Footer from "../Home/Footer/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

function Calculator() {
  const [vegetable, setVegetable] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

// State for market data chart
  const [marketData, setMarketData] = useState([]);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [marketError, setMarketError] = useState(null);

  // Color palette for bars
  const colors = ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#f44336', '#00bcd4', '#ffeb3b'];
  const getBarColor = (index) => colors[index % colors.length];


  const handleCalculate = async () => {
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    setCalculating(true);
    try {
      const res = await axios.post("http://localhost:5000/calculate", {
        vegetable,
        quantity: Number(quantity),
        unit,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Error calculating earnings:", err);
      alert("Error calculating earnings");
    } finally {
      setCalculating(false);
    }
  };

  

  // Fetch market data for chart
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/markets");
        if (res.data) {
          setMarketData(res.data);
        } else {
          setMarketError("Failed to fetch market data");
        }
      } catch (err) {
        console.error(err);
        setMarketError("Server error fetching market data");
      } finally {
        setLoadingMarket(false);
      }
    };
    fetchMarketData();
  }, []);

  return (
    <div>
      <Nav />
      <div className="features-content-layout">
        <Navi />

        {/* Market Insight Chart */}
        <div
          className="market-chart-container"
          style={{ width: '100%', height: 400, margin: '120px' }}
        >
          <h2>Market Prices</h2>
          {loadingMarket ? (
            <p>Loading market data...</p>
          ) : marketError ? (
            <p className="error">{marketError}</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData}
                layout="vertical"
                margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="vegname" />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" barSize={20}>
                  {marketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>


        <div className="features-main-content">
          <div className="calculator-card" style={{ width: '100%', margin: '120px' }}>
            <h2>Harvest Profit Estimator</h2>

            <div className="form-groupro">
              <label>Vegetable:</label>
              <VegetableDropdown 
                onSelect={(selectedVeg) => {
                  setVegetable(selectedVeg);
                  setResult(null);
                }} 
                selectedValue={vegetable}
              />
            </div>

            <div className="form-groupro">
              <label>Quantity:</label>
              <div className="input-groupro">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => { 
                    setQuantity(e.target.value); 
                    setResult(null); 
                  }}
                  placeholder="Enter quantity"
                />
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                </select>
              </div>
            </div>

            <button onClick={handleCalculate} disabled={calculating}>
              {calculating ? "Calculating..." : "Calculate"}
            </button>

            {result && (
              <div className="result-container">
                <h3>Result:</h3>
                <p>
                  {result.quantity} {result.unit} of {result.vegetable} at LKR {result.pricePerKg}/kg
                  = <strong>LKR {result.earnings}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer /> 
    </div>
  );
}

export default Calculator;