// 1️⃣ Imports
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Bpayment.css"; // ✅ External CSS

// 2️⃣ Component
function Bpayment({ payment }) {
  const { _id, payment_id, company_name, amount, payment_method, bank_receipt, order_pdf } = payment;
  const navigate = useNavigate();

  // Delete payment
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/payments/${_id}`);
      alert("Payment deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete payment: " + (err.response?.data?.error || err.message));
    }
  };

  // Cancel order → navigate to cancel form page
  /*const cancelHandler = () => {
    navigate(`/bcancelorder/`); // Replace with your cancel form route
  };*/

  return (
    <div className="payment-card">
      <h2 className="payment-id">Buyer NIC: {payment_id || "not yet"}</h2>
      <p><strong>Company Name:</strong> {company_name || "not yet"}</p>
      <p><strong>Amount (LKR):</strong> {amount || "not yet"}</p>
      <p><strong>Method:</strong> {payment_method || "not yet"}</p>
      <p>
        <strong>Bank Receipt:</strong>{" "}
        {bank_receipt ? (
          <a href={`http://localhost:5000/${bank_receipt}`} target="_blank" rel="noreferrer">View</a>
        ) : "not yet"}
      </p>
      <p>
        <strong>Order PDF:</strong>{" "}
        {order_pdf ? (
          <a href={`http://localhost:5000/${order_pdf}`} target="_blank" rel="noreferrer">View</a>
        ) : "not yet"}
      </p>

      {/* Buttons */}
      <div className="payment-actions">
        <button className="delete-btn" onClick={deleteHandler}>Delete Payment</button>
        
      </div>
    </div>
  );
}

export default Bpayment;