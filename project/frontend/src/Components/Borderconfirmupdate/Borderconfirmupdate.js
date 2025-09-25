import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import Bfooter from "../Bfooter/Bfooter";
import Bheader from '../Bheader/Bheader';
import "./Borderconfirmupdate.css"; 

function Borderupdate() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/confirmb/${id}`)
        .then((res)=> res.data)
        .then((data) => setInputs(data.order));
    };
    fetchHandler();
  }, [id]);

  // Auto calculate totalPrice when quantity or pricePerKg changes
  useEffect(() => {
    if (inputs.quantity && inputs.pricePerKg) {
      const total = inputs.quantity * inputs.pricePerKg;
      setInputs(prev => ({ ...prev, totalPrice: total }));
    }
  }, [inputs.quantity, inputs.pricePerKg]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/confirmb/${id}`, {
      buyerId: String(inputs.buyerId),
      farmerId: String(inputs.farmerId),
      cropId: String(inputs.cropId),
       pricePerKg: Number(inputs.pricePerKg),
      quantity: Number(inputs.quantity), 
      unit: String(inputs.unit),
      totalPrice: Number(inputs.totalPrice),
     
      paymentMethod: String(inputs.paymentMethod),
      deliveryaddress: String(inputs.deliveryaddress),
      orderdate: inputs.orderdate ? new Date(inputs.orderdate) : undefined,
    })
    .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest();
      alert("Order updated successfully!");
      history('/confirmorder');
    } catch (err) {
      console.error(err);
      alert("Failed to update order. Please try again.");
    }
  };

  return (
    <div>
      <Bheader/>
      <div className="update-page">
        <h1 className="uh1">Update The Order</h1>
        <form className="update-form" onSubmit={handleSubmit}>
          
          <label>Farmer NIC:</label>
          <input type="text" name="farmerId" value={inputs.farmerId} onChange={handleChange} readOnly />
          <label>Crop Name:</label>
          <input type="text" name="cropId" value={inputs.cropId} onChange={handleChange} readOnly />
          <label>Price Per 1kg:</label>
          <input type="number" name="pricePerKg" value={inputs.pricePerKg || 0} readOnly />
          <label>Quantity:</label>
          <input type="number" name="quantity" value={inputs.quantity} onChange={handleChange} required />
          <label>Unit:</label>
          <select name="unit" value={inputs.unit} onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="ton">ton</option>
          </select>      
          <label>Total Amount (LKR):</label>
          <input type="number" step="0.01" name="totalPrice" value={inputs.totalPrice || 0} required />
          <label>Payment Method:</label>
          <select name="paymentMethod" value={inputs.paymentMethod} onChange={handleChange}>
            <option value="cash on delievery">Cash On Delievery</option>
            <option value="Bank Receipt">Bank</option>
          </select>
          <label>Delivery Address:</label>
          <input type="text" name="deliveryaddress" value={inputs.deliveryaddress} onChange={handleChange} />
          <label>Date of Order:</label>
          <input type="date" name="orderdate" value={inputs.orderdate} onChange={handleChange} />
          <button type="submit">Update</button>
        </form>
      </div>
      <Bfooter/>
    </div>
  );
}

export default Borderupdate;