import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Bfooter from "../Bfooter/Bfooter";
import Bheader from "../Bheader/Bheader";
import "./Borderconfirmadd.css";

function AddConfirmb() {
  const navigate = useNavigate();
  const location = useLocation();
  const cropInfo = location.state || {};

  const today = new Date().toISOString().split("T")[0];

  const [inputs, setInputs] = useState({
   
    buyerId: "",
    farmerId: cropInfo.farmerId || "",
    cropId: cropInfo.cropName || "",
    pricePerKg: cropInfo.pricePerKg || 0,
    quantity: "",
    unit: "kg",
    totalPrice: 0,
    paymentMethod: "cash on delievery",
    deliveryaddress: "",
    orderdate: today,
  });

  // Update totalPrice when quantity changes
  useEffect(() => {
    const total = inputs.quantity * inputs.pricePerKg;
    setInputs(prev => ({ ...prev, totalPrice: total }));
  }, [inputs.quantity, inputs.pricePerKg]);

  const handleChange = (e) => {
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:5000/confirmb", {
    
      buyerId: String(inputs.buyerId),
      farmerId: String(inputs.farmerId),
      cropId: String(inputs.cropId),
      pricePerKg:Number(inputs.pricePerKg),
      quantity: Number(inputs.quantity),
      unit: String(inputs.unit),
      totalPrice: Number(inputs.totalPrice),
      paymentMethod: String(inputs.paymentMethod),
      deliveryaddress: String(inputs.deliveryaddress),
      orderdate: inputs.orderdate ? new Date(inputs.orderdate) : undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest();
      alert("Order added successfully!");
      navigate("/confirmorder");
    } catch (err) {
      console.error(err);
      alert("Failed to add order. Please try again.");
    }
  };

  return (
    <div>
      <Bheader />
      <div className="byaddorder-page">
        <h2 className="byorder-title">Add Order</h2>

        <div className="byform-and-extra-buttons">
          <form className="byorder-form" onSubmit={handleSubmit}>
            <label>Buyer NIC:</label>
            <input type="text" name="buyerId" value={inputs.buyerId} onChange={handleChange} required />
            <label>Farmer NIC:</label>
            <input type="text" name="farmerId" value={inputs.farmerId} onChange={handleChange} readOnly />
            <label>Crop Name:</label>
            <input type="text" name="cropId" value={inputs.cropId} onChange={handleChange} readOnly />
            <label>Price Per 1kg (Rs.):</label>
            <input type="number" name="pricePerKg" value={inputs.pricePerKg} readOnly  />
            <label>Quantity:</label>
            <input type="number" name="quantity" value={inputs.quantity} onChange={handleChange} required />
            <label>Unit:</label>
            <select name="unit" value={inputs.unit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="ton">ton</option>
            </select>
            <label>Total Amount (LKR):</label>
            <input type="number" step="0.01" name="totalPrice" value={inputs.totalPrice} readOnly />
            <label>Payment Method:</label>
            <select name="paymentMethod" value={inputs.paymentMethod} onChange={handleChange}>
              <option value="cash on delievery">Cash On Delievery</option>
              <option value="Bank Receipt">Bank</option>
            </select>
            <label>Delivery Address:</label>
            <textarea
              name="deliveryaddress"
              value={inputs.deliveryaddress}
              onChange={handleChange}
              rows="4"
              placeholder="Enter full delivery address"
            />
            <label>Date of Order:</label>
            <input type="date" name="orderdate" value={inputs.orderdate} onChange={handleChange} />
<div className="byorder-buttons">
            <div className="byback-buttons">
              <button type="button" onClick={() => navigate(-1)}>Back</button>
              </div>
              <div className="byaor-buttons">
              <button type="submit">Add Order</button>
            </div>
            </div>
          </form>

          
        </div>
      </div>
      <Bfooter />
    </div>
  );
}

export default AddConfirmb;