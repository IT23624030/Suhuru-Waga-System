import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Bfooter from "../Bfooter/Bfooter";
import Bheader from '../Bheader/Bheader';
import "./Borderconfirmdisplay.css"; 
import jsPDF from "jspdf";

const URL = "http://localhost:5000/confirmb";

function Borderconfirmdisplay() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(URL)
      .then(res => setOrders(res.data.orders || []))
      .catch(err => console.error(err));
  }, []);

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${URL}/${id}`);
      setOrders(orders.filter(order => order._id !== id));
      alert("Order deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete order.");
    }
  };

  const payHandler = (order) => {
    navigate(`/bpay/`, { state: { order } });
  };

  /*const cancelHandler = (order) => {
    navigate(/bcancelorder, { 
      state: { 
        cancel_id: order.buyerId, 
        order_id: order.farmerId
      }
    });
    <button className="cancel-btn" onClick={() => cancelHandler(order)}>Cancel</button>
 */

  const downloadPDF = (order) => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Order Details`, 14, y);
    y += 10;

    const details = [
      ["Buyer NIC:", order.buyerId || "N/A"],
      ["Farmer NIC:", order.farmerId || "N/A"],
      ["Crop Name:", order.cropId || "N/A"],
      ["Price Per 1kg:", order.pricePerKg || "N/A"],
      ["Quantity:", order.quantity || "N/A"],
      ["Unit:", order.unit || "N/A"],
      ["Total Price:", order.totalPrice || "N/A"],
      ["Payment Method:", order.paymentMethod || "N/A"],
      ["Delivery Address:", order.deliveryaddress || "N/A"],
      ["Order Date:", order.orderdate ? new Date(order.orderdate).toLocaleDateString() : "N/A"]
    ];

    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(label, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 55, y);
      y += 6;
    });

    doc.save(`order_${order._id}.pdf`);
  };

  return (
    <div>
      <Bheader/>
      <div className="bcforder-display-container">
        <h1>Order Details Display</h1>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="bcforder-table">
            <thead>
              <tr>
                <th>Buyer NIC</th>
                <th>Farmer NIC</th>
                <th>Crop Name</th>
                <th>Price Per 1kg</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Total Price</th>
                <th>Payment Method</th>
                <th>Delivery Address</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className={i % 2 === 0 ? "even-row" : ""}>
                  <td>{order.buyerId}</td>
                  <td>{order.farmerId}</td>
                  <td>{order.cropId}</td>
                  <td>{order.pricePerKg}</td>
                  <td>{order.quantity}</td>
                  <td>{order.unit}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.deliveryaddress}</td>
                  <td>{order.orderdate ? new Date(order.orderdate).toLocaleDateString() : "N/A"}</td>
                  <td className="bcfaction-buttons">
  <button className="bcfupdate-btn" onClick={() => navigate(`/confirmorder/${order._id}`)}>
  Edit
</button>

                   <button className="bcfdelete-btn" onClick={() => deleteHandler(order._id)}>
  Delete
</button>

                  

                    <button className="bcfpay-btn" onClick={() => payHandler(order)}>Pay</button>
                    
                    
                    <button className="bcfdownload-btn" onClick={() => downloadPDF(order)}>Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Bfooter/>
    </div>
  );
}

export default Borderconfirmdisplay;