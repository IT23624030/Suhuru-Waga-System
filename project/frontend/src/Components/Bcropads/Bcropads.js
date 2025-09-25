import React, { useEffect, useState } from "react";
import axios from "axios";
import Bfooter from "../Bfooter/Bfooter";
import Bheader from "../Bheader/Bheader";
import Bcropcard from "../Bcropcard/Bcropcard";
import "./Bcropads.css";

const staticAds = [
  { crop_name: "Mango", category: "Fruit", price: 250, quantity_available: 50, location: "Kandy", farmer_id: "199923236563", image: "/mango.jpeg" },
  { crop_name: "Tomato", category: "Vegetable", price: 150, quantity_available: 100, location: "Colombo", farmer_id: "189923236563", image: "/tomato.jpeg" },
  { crop_name: "Banana", category: "Fruit", price: 100, quantity_available: 200, location: "Galle", farmer_id: "200023236563", image: "/banana.jpeg" },
  { crop_name: "Brinjal", category: "Vegetable", price: 100, quantity_available: 200, location: "Galle", farmer_id: "200223236563", image: "/bringle.jpeg" },
  { crop_name: "Carrot", category: "Vegetable", price: 90, quantity_available: 200, location: "Nuwara Eliya", farmer_id: "2000323236563", image: "/carrot.jpeg" },
  { crop_name: "Bean", category: "Vegetable", price: 100, quantity_available: 200, location: "Monaragala", farmer_id: "200123236563", image: "/bean.jpeg" },
  { crop_name: "Watermelon", category: "Fruit", price: 100, quantity_available: 200, location: "Galle", farmer_id: "199823236563", image: "/melon.jpeg" },
  { crop_name: "Cabbage", category: "Vegetable", price: 200, quantity_available: 150, location: "Galle", farmer_id: "200568923611", image: "/cabbage.jpeg" },
];

function Bcropads() {
  const [backendCrops, setBackendCrops] = useState([]);
  const [filters, setFilters] = useState({ search_keyword: "", category: "", location: "", sort_by: "" });
  const [displayCrops, setDisplayCrops] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/crops")
      .then(res => {
        setBackendCrops(res.data);
        setDisplayCrops([...staticAds, ...res.data]); // initially show all
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    let allCrops = [...staticAds, ...backendCrops];

    if (filters.search_keyword) {
      allCrops = allCrops.filter(cropD =>
        cropD.crop_name.toLowerCase().includes(filters.search_keyword.toLowerCase())
      );
    }

    if (filters.category) {
      allCrops = allCrops.filter(cropD =>
        cropD.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.location) {
      allCrops = allCrops.filter(cropD =>
        cropD.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.sort_by === "price_low_high") {
      allCrops.sort((a, b) => a.price - b.price);
    } else if (filters.sort_by === "price_high_low") {
      allCrops.sort((a, b) => b.price - a.price);
    }

    setDisplayCrops(allCrops);
  };

  return (
    <div>
      <Bheader />

      <div  className="bycropads-container">
        <h2>🔍 Search, Filter & Sort Crops</h2>

        {/* Search bar */}
        <div className="bysearch-container">
          <input type="text" name="search_keyword" placeholder="Search by name" value={filters.search_keyword} onChange={handleChange} />
          <input type="text" name="category" placeholder="Category" value={filters.category} onChange={handleChange} />
          <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
          <select name="sort_by" value={filters.sort_by} onChange={handleChange}>
            <option value="">Sort By</option>
            <option value="price_low_high">Price: Low → High</option>
            <option value="price_high_low">Price: High → Low</option>
          </select>
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Crop cards */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          {displayCrops.length > 0
            ? displayCrops.map((cropD, index) => <Bcropcard key={cropD._id || index} cropD={cropD} />)
            : <p style={{ marginTop: "20px", fontSize: "18px", color: "gray" }}>No crops found</p>}
        </div>
      </div>

      <Bfooter />
    </div>
  );
}

export default Bcropads;