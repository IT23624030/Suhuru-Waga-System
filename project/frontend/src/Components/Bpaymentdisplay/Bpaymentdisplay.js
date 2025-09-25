import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Bfooter from "../Bfooter/Bfooter";
import Bheader from "../Bheader/Bheader";
import "./Bpaymentdispaly.css";

function Bpaymentdisplay() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Navigate to cancel order form
  const handleCancel = (payment) => {
    navigate(`/bcancelorder`, {
      state: {
        cancel_id: payment.payment_id, // buyer NIC
        order_id: payment.company_name, // change to actual order ID if needed
      },
    });
  };

  return (
    <div>
      <Bheader />
      <div className="bpay-display-container">
        <h1>All Payments</h1>
        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <table className="bpayment-table">
            <thead>
              <tr>
                <th>Buyer NIC</th>
                <th>Company Name</th>
                <th>Amount (LKR)</th>
                <th>Method</th>
                <th>Bank Receipt</th>
                <th>Order PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={payment._id}
                  className={index % 2 === 0 ? "even-row" : ""}
                >
                  <td>{payment.payment_id || "not yet"}</td>
                  <td>{payment.company_name || "not yet"}</td>
                  <td>{payment.amount || "not yet"}</td>
                  <td>{payment.payment_method || "not yet"}</td>
                  <td>
                    {payment.bank_receipt ? (
                      <a
                        href={`http://localhost:5000/${payment.bank_receipt}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#36c54eff",
                          color: "#fff",
                          textDecoration: "none",
                          borderRadius: "5px",
                          fontSize: "13px",
                        }}
                      >
                        View Receipt
                      </a>
                    ) : (
                      <span
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#ccc",
                          color: "#fff",
                          borderRadius: "5px",
                          fontSize: "13px",
                        }}
                      >
                        N/A
                      </span>
                    )}
                  </td>
                  <td>
                    {payment.order_pdf ? (
                      <a
                        href={`http://localhost:5000/${payment.order_pdf}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          textDecoration: "none",
                          borderRadius: "5px",
                          fontSize: "13px",
                        }}
                      >
                        View Order
                      </a>
                    ) : (
                      <span
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#ccc",
                          color: "#fff",
                          borderRadius: "5px",
                          fontSize: "13px",
                        }}
                      >
                        N/A
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={() => handleCancel(payment)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#ff4d4d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Cancel
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

export default Bpaymentdisplay;