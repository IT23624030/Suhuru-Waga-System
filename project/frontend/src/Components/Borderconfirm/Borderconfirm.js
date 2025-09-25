import React from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./Borderconfirm.css"; 

function Borderconfirm(props) {
  const { _id, buyerId, farmerId, cropId, pricePerKg, quantity, unit, totalPrice, paymentMethod, deliveryaddress, orderdate } = props.order;
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/confirmb/${_id}`);
      alert("Order deleted successfully!");
      navigate("/confirmorder");
    } catch (err) {
      console.error(err);
      alert("Failed to delete order. Please try again.");
    }
  };

  const payHandler = () => {
    navigate(`/bpay/`, { state: { order: props.order } });
  };

  // ✅ Cancel handler: navigate with buyerId and farmerId
  const cancelHandler = () => {
    navigate(`/bcancelorder`, { 
      state: { 
        cancel_id: buyerId,   // cancel_id = buyer NIC
        order_id: farmerId    // order_id = farmer NIC
      }
    });
  };

  return (
    <div className="order-card">
      <h2>Order Details</h2>

      <h1>Buyer NIC: {buyerId}</h1>
      <h1>Farmer NIC: {farmerId}</h1>
      <h1>Crop Name: {cropId}</h1>
      <h1>Price Per 1kg: Rs. {pricePerKg || "N/A"}</h1>
      <h1>Quantity: {quantity}</h1>
      <h1>Unit: {unit}</h1>
      <h1>Total Amount (LKR): {totalPrice}</h1>
      <h1>Payment Method: {paymentMethod}</h1>
      <h1>Delivery Address: {deliveryaddress}</h1>
      <h1>Order Date: {orderdate ? new Date(orderdate).toLocaleDateString() : "N/A"}</h1>

      <div className="button-group">
        <Link to={`/confirmorder/${_id}`} className="update-btn">Update</Link>
        <button className="delete-btn" onClick={deleteHandler}>Delete</button>
        <button className="pay-btn" onClick={payHandler}>Payments </button>
        <button className="cancel-btn" onClick={cancelHandler}>Cancel Order</button>
      </div>
    </div>
  );
}

export default Borderconfirm;