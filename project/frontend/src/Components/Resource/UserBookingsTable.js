import React, { useEffect, useState } from "react";
import "./UserBookingTable.css";
import Footer from "../Home/Footer/Footer";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [hoveredBookings, setHoveredBookings] = useState(() => {
    const stored = localStorage.getItem("hoveredUserBookings");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/bookings/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();

        const sortedByDate = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(b => ({ ...b, isNew: !hoveredBookings[b._id] }));

        setBookings(sortedByDate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserBookings();
  }, [userId, hoveredBookings]);

  const toggleExpandRow = (bookingId) => {
    setExpandedBookingId(prev => (prev === bookingId ? null : bookingId));
    setReceiptFile(null);
    setPreviewFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setReceiptFile(file);
    if (file) setPreviewFile(URL.createObjectURL(file));
  };

  // Farmer uploads receipt; status stays Pending
  const handleUploadReceipt = async (bookingId) => {
    if (!receiptFile) return alert("Please select a file first!");
    const formData = new FormData();
    formData.append("receipt", receiptFile);

    try {
      const res = await fetch(`http://localhost:5000/bookings/${bookingId}/upload-receipt`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload receipt");

      const updatedBooking = await res.json();
      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId
            ? { ...b, receiptFileName: updatedBooking.booking.receiptFileName, status: "Pending", isNew: false }
            : b
        )
      );
      setExpandedBookingId(null);
      alert("Receipt uploaded! Waiting for owner confirmation.");
    } catch (err) {
      console.error(err);
      alert("Error uploading receipt: " + err.message);
    }
  };

  const handleRemoveBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to remove this booking?")) return;
    try {
      const res = await fetch(`http://localhost:5000/bookings/${bookingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove booking");

      setBookings(prev => prev.filter(b => b._id !== bookingId));
      alert("Booking removed successfully!");
    } catch (err) {
      console.error(err);
      alert("Error removing booking: " + err.message);
    }
  };

  const handleRowHover = (bookingId) => {
    if (!hoveredBookings[bookingId]) {
      const updated = { ...hoveredBookings, [bookingId]: true };
      setHoveredBookings(updated);
      localStorage.setItem("hoveredUserBookings", JSON.stringify(updated));
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, isNew: false } : b)
      );
    }
  };

  return (
      <div className="ub-wrapper">
        <header className="ub-header">
          <h1 className="ub-title">📑 My Bookings</h1>
          <p className="ub-subtitle">View and track your bookings</p>
        </header>

        <main className="ub-main">
          {loading ? <p>Loading bookings...</p> :
           error ? <p className="ub-error">{error}</p> :
           bookings.length === 0 ? <p>You don’t have any bookings yet.</p> :
           <table className="ub-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Resource</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <React.Fragment key={booking._id}>
                  <tr
                    onMouseEnter={() => handleRowHover(booking._id)}
                    className={`ub-table-row ${booking.isNew ? "ub-new-booking" : ""}`}
                  >
                    <td>{booking._id}</td>
                    <td>{booking.resourceName}</td>
                    <td>{booking.quantity}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{booking.status}</td>
                    <td>
                      {booking.receiptFileName ? (
                        <a
                          href={`http://localhost:5000/uploads/${booking.receiptFileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ub-receipt-link"
                        >
                          📄 {booking.receiptFileName}
                        </a>
                      ) : "No receipt"}
                    </td>
                    <td>
                      <button
                        className="ub-confirm-btn"
                        onClick={() => toggleExpandRow(booking._id)}
                        disabled={booking.status === "Confirmed" || booking.status === "Rejected"}
                      >
                        Upload Receipt
                      </button>
                      <button
                        className="ub-remove-btn"
                        onClick={() => handleRemoveBooking(booking._id)}
                      >
                        Remove Booking
                      </button>
                    </td>
                  </tr>

                  {expandedBookingId === booking._id && (
                    <tr className="ub-expanded-row">
                      <td colSpan="7">
                        <div className="ub-upload-container">
                          <input
                            className="ub-file-input"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                          />
                          <button className="ub-upload-btn" onClick={() => handleUploadReceipt(booking._id)}>Upload Receipt</button>
                          <button className="ub-cancel-btn" onClick={() => setExpandedBookingId(null)}>Cancel</button>
                        </div>
                        {previewFile && (
                          <div className="ub-preview">
                            {receiptFile?.type?.startsWith("image/") ? (
                              <img
                                src={previewFile}
                                alt="preview"
                                className="ub-preview-img"
                              />
                            ) : (
                              <span>📄 File selected: {receiptFile?.name}</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
           </table>
          }
        </main>
      </div>
      
  );
};

export default UserBookings;
