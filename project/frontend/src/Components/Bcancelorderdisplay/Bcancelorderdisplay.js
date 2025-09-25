import React, { useState, useEffect } from "react";
import axios from "axios";
import Bfooter from "../Bfooter/Bfooter";
import Bheader from '../Bheader/Bheader';
import "./Bcancelorderdisplay.css"; // optional CSS for styling

function Bcancelorderdisplay() {
  const [cancelOrders, setCancelOrders] = useState([]);

  const fetchCancelOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bcancelorders");
      setCancelOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch cancel orders", err);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cancel order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bcancelorders/${id}`);
      alert("Cancel order deleted successfully!");
      setCancelOrders(cancelOrders.filter(order => order._id !== id)); // update state
    } catch (err) {
      console.error(err);
      alert("Failed to delete cancel order: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchCancelOrders();
  }, []);

  return (
    <div>
      <Bheader />
      <div className="cancel-display-container" style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>All Cancel Orders</h1>
        {cancelOrders.length === 0 ? (
          <p>No cancel orders yet.</p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "Arial, sans-serif",
          }}>
            <thead>
              <tr style={{ backgroundColor: "#32c434ff", color: "White" }}>
                <th style={{ padding: "10px", border: "2px solid #000000ff" }}>Buyer NIC</th>
                <th style={{ padding: "10px", border: "2px solid #000000ff" }}>Company Name</th>
                <th style={{ padding: "10px", border: "2px solid #000000ff" }}>Reason</th>
                <th style={{ padding: "10px", border: "2px solid #000000ff" }}>Cancel Date</th>
                <th style={{ padding: "10px", border: "2px solid #000000ff" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cancelOrders.map((order, index) => (
                <tr key={order._id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ padding: "10px", border: "2px solid #000000ff" }}>{order.cancel_id || "not yet"}</td>
                  <td style={{ padding: "10px", border: "2px solid #000000ff" }}>{order.order_id || "not yet"}</td>
                  <td style={{ padding: "10px", border: "2px solid #000000ff" }}>{order.reason || "not yet"}</td>
                  <td style={{ padding: "10px", border: "2px solid #000000ff" }}>{order.cancel_date ? new Date(order.cancel_date).toLocaleDateString() : "not yet"}</td>
                  <td style={{ padding: "10px", border: "2px solid #000000ff", textAlign: "center" }}>
                    <button
                      onClick={() => deleteHandler(order._id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Bfooter />
    </div>
  );
}

export default Bcancelorderdisplay;