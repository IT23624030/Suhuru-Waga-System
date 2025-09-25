import React, { useEffect, useState } from "react";
import "./UserListing.css"; // renamed file for clarity

const UserResources = ({ userId }) => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredResources, setHoveredResources] = useState(() => {
    const stored = localStorage.getItem("hoveredResources");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) throw new Error("No user ID provided");

        const resResources = await fetch(
          `http://localhost:5000/resources/user/${userId}`
        );
        if (!resResources.ok) throw new Error("Failed to fetch resources");
        const resourceData = await resResources.json();

        const sortedResources = resourceData
          .sort(
            (a, b) =>
              new Date(b.metadata?.createdAt) - new Date(a.metadata?.createdAt)
          )
          .map((r) => ({ ...r, isNew: !hoveredResources[r._id] }));

        setResources(sortedResources);

        const resBookings = await fetch(`http://localhost:5000/bookings`);
        if (!resBookings.ok) throw new Error("Failed to fetch bookings");
        const bookingData = await resBookings.json();

        const myResourceIds = sortedResources.map((r) => r._id);
        const myBookings = bookingData
          .filter((b) => myResourceIds.includes(b.resourceId))
          .map((b) => {
            const resource = sortedResources.find(
              (r) => r._id === b.resourceId
            );
            return { ...b, resourceName: resource?.name || b.resourceId };
          });

        setBookings(myBookings);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, hoveredResources]);

  const handleRowHover = (resourceId) => {
    if (!hoveredResources[resourceId]) {
      const updated = { ...hoveredResources, [resourceId]: true };
      setHoveredResources(updated);
      localStorage.setItem("hoveredResources", JSON.stringify(updated));
      setResources((prev) =>
        prev.map((r) => (r._id === resourceId ? { ...r, isNew: false } : r))
      );
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update booking status");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, status: newStatus, hideActions: true }
            : b
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this resource and all its bookings?"
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/resources/${resourceId}/full`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete resource and bookings");

      setResources((prev) => prev.filter((r) => r._id !== resourceId));
      setBookings((prev) => prev.filter((b) => b.resourceId !== resourceId));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="user-resources-error">{error}</p>;

  return (
      <div className="user-resources-wrapper">
        <header className="user-resources-header">
          <h1 className="user-resources-title">📦 My Resources</h1>
          <p className="user-resources-subtitle">
            View and manage resources you have added
          </p>
        </header>

        {/* Resources Table */}
        <main>
          <div className="user-resources-table-container">
            <table className="user-resources-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Total Units</th>
                  <th>Available Units</th>
                  <th>Base Rate</th>
                  <th>Max Price Ceiling</th>
                  <th>Low Stock?</th>
                  <th>Created At</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr
                    key={res._id}
                    className={`${
                      res.shortageFlags?.isLowStock
                        ? "user-resources-low"
                        : "user-resources-ok"
                    } ${res.isNew ? "user-resources-new" : ""}`}
                    onMouseEnter={() => handleRowHover(res._id)}
                  >
                    <td>{res._id}</td>
                    <td>{res.name}</td>
                    <td>{res.category}</td>
                    <td className="user-resources-center">
                      {res.availability?.totalUnits ?? "-"}
                    </td>
                    <td className="user-resources-center">
                      {res.availability?.availableUnits ?? "-"}
                    </td>
                    <td className="user-resources-center">
                      Rs. {res.pricing?.baseRate ?? "-"}
                    </td>
                    <td className="user-resources-center">
                      Rs. {res.pricing?.maxPriceCeiling ?? "-"}
                    </td>
                    <td>{res.shortageFlags?.isLowStock ? "Yes" : "No"}</td>
                    <td>
                      {res.metadata?.createdAt
                        ? new Date(res.metadata.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {res.metadata?.lastUpdated
                        ? new Date(res.metadata.lastUpdated).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="user-resources-delete-btn"
                        onClick={() => handleDeleteResource(res._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bookings Table */}
          <header
            className="user-resources-header"
            style={{ marginTop: "2rem" }}
          >
            <h1 className="user-resources-title">📄 Users Booking Requests</h1>
            <p className="user-resources-subtitle">
              View booking requests for your resources
            </p>
          </header>
          {bookings.length === 0 ? (
            <p>No booking requests yet.</p>
          ) : (
            <div className="user-resources-table-container">
              <table className="user-resources-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Resource</th>
                    <th>Farmer Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Duration (hrs)</th>
                    <th>Partial Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b._id}</td>
                      <td>{b.resourceName}</td>
                      <td>{b.farmerName}</td>
                      <td>{b.farmerContact}</td>
                      <td>{b.farmerEmail}</td>
                      <td>{new Date(b.date).toLocaleString()}</td>
                      <td>{b.durationHours}</td>
                      <td>{b.partialPayment ? "Yes" : "No"}</td>
                      <td>{b.status ?? "Pending"}</td>
                      <td>
                        {!b.hideActions ? (
                          <>
                            <button
                              className="user-resources-confirm-btn"
                              onClick={() =>
                                handleUpdateBookingStatus(b._id, "Confirmed")
                              }
                            >
                              Confirm
                            </button>
                            <button
                              className="user-resources-reject-btn"
                              onClick={() =>
                                handleUpdateBookingStatus(b._id, "Rejected")
                              }
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span>{b.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
  );
};

export default UserResources;
