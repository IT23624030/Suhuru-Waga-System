import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Bfooter from "../Bfooter/Bfooter";
import Bheader from '../Bheader/Bheader';
import "./Bcancelorderadd.css"; 

function Bcancelorderadd() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get prefilled values from navigation state
  const { cancel_id, order_id } = location.state || {};

  const [inputs, setInputs] = useState({
    cancel_id: cancel_id || "",
    order_id: order_id || "",
    reason: "",
    refund_status: "Pending"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/bcancelorders", inputs);
      alert("Cancel order submitted successfully!");
      navigate("/bcancelorderdisplay");
    } catch (err) {
      alert("Error submitting cancel order: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <Bheader/>
      <div className="bccancel-page">
        <div className="bccancel-form-container">
          <h2>Cancel Order</h2>
          <form onSubmit={handleSubmit}>
            <label>Buyer NIC:</label>
            <input type="text" name="cancel_id" value={inputs.cancel_id} readOnly />
            
            <label>Company Name:</label>
            <input type="text" name="order_id" value={inputs.order_id} readOnly />
            
            <label>Reason for Cancel:</label>
            <textarea
              name="reason"
              value={inputs.reason}
              onChange={handleChange}
              required/>
           
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <Bfooter/>
    </div>
  );
}

export default Bcancelorderadd;