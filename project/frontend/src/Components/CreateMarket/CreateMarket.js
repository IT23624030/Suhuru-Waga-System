import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateMarket.css";
import Nav from "../Home/Nav/Nav2";

function CreateMarket() {
  const [formData, setFormData] = useState({
    vegname: "",
    price: "",
  });

  const [markets, setMarkets] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch all markets
  const fetchMarkets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/markets");
      setMarkets(res.data);
    } catch (err) {
      console.error("Error fetching markets:", err);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Create new market item
  const createMarket = async () => {
    try {
      const res = await axios.post("http://localhost:5000/market", formData);
      return res.data;
    } catch (err) {
      console.error("Error creating market item:", err);
      throw err;
    }
  };

  // Update existing market item
  const updateMarket = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/market/${id}`, formData);
      return res.data;
    } catch (err) {
      console.error("Error updating market item:", err);
      throw err;
    }
  };

  // Delete a market item
  const deleteMarket = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/market/${id}`);
      fetchMarkets();
    } catch (err) {
      console.error("Error deleting market item:", err);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateMarket(editId);
        alert("✅ Market item updated successfully");
      } else {
        await createMarket();
        alert("✅ Market item created successfully");
      }
      setFormData({ vegname: "", price: "" });
      setEditId(null);
      fetchMarkets();
    } catch (err) {
      alert("⚠️ Something went wrong. Check console for details.");
    }
  };

  // Edit button click
  const handleEdit = (market) => {
    setFormData({ vegname: market.vegname, price: market.price });
    setEditId(market._id);
  };

  return (
    <div>
      <Nav />
      <div className="market-container">
        <div className="market-hero-image">
          <div className="hero-text-container">
            <h1 className="hero-title">Market Management</h1>
            <p className="hero-subtitle">
              Create, Edit, and Manage Market Insight Efficiently.
            </p>
          </div>
        </div>

        <div className="market-side">
          <h1 className="market-title"></h1>
        </div>

        <div className="market-form-container">
          <form className="market-form" onSubmit={handleSubmit}>
            <h2>{editId ? "Edit Market Item" : "New Market Item"}</h2>
            <p>Enter details below :-</p>

            <input
              type="text"
              name="vegname"
              placeholder="Enter Vegetable Name"
              value={formData.vegname}
              onChange={handleInputChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Enter Price of 1Kg"
              value={formData.price}
              onChange={handleInputChange}
              required
            />

            <button type="submit" className="market-btn">
              {editId ? "Update Item" : "Save Item"}
            </button>
          </form>

          <hr />

          <h2>Existing Market Items</h2>
          <table className="market-table">
            <thead>
              <tr>
                <th>Vegetable Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market) => (
                <tr key={market._id}>
                  <td>{market.vegname}</td>
                  <td>{market.price}</td>
                  <td>
                    <div className="action-btn-container">
                      <button
                        className="actionro-btn edit"
                        onClick={() => handleEdit(market)}
                      >
                        Edit
                      </button>
                      <button
                        className="actionro-btn delete"
                        onClick={() => deleteMarket(market._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreateMarket;
