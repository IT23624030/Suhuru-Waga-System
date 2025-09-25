import React from "react";
import axios from "axios";


function Bcancelorder({ cancelOrder }) {
  if (!cancelOrder) return null;
  const { _id, cancel_id, order_id, reason, cancel_date } = cancelOrder;

  //  Delete handler
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this cancel order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bcancelorders/${_id}`);
      alert("Cancel order deleted successfully!");
      window.location.reload(); // simple refresh
    } catch (err) {
      console.error(err);
      alert("Failed to delete cancel order: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Buyer NIC: {cancel_id || "not yet"}</h2>
      <h3>Farmer NIC: {order_id || "not yet"}</h3>
      <h3>Reason: {reason || "not yet"}</h3>
      <h3>Cancel Date: {new Date(cancel_date).toLocaleDateString() || "not yet"}</h3>
      

      {/* Delete button */}
      <button
        onClick={deleteHandler}
        style={{
          marginTop: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Delete Order
      </button>
    </div>
  );
}

export default Bcancelorder;