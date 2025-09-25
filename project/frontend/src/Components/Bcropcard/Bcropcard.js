import React from "react";
import { useNavigate } from "react-router-dom";

function Bcropcard({ cropD }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "280px",
        background: "#f7f7f7ff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transition: "transform 0.2s",
      }}
    >
      <img
        src={cropD.image}
        alt={cropD.crop_name}
        style={{ width: "100%", height: "180px", objectFit: "cover" }}
      />
      <div style={{ padding: "12px", textAlign: "left" }}>
        <h2 style={{ margin: "0 0 8px", color: "#2e7d32" }}>{cropD.crop_name}</h2>

        <p>
          <strong>Category:</strong> {cropD.category}
        </p>
        <p>
          <strong>Price (Per 1kg):</strong> Rs. {cropD.price}
        </p>
        <p>
          <strong>Available Quantity:</strong> {cropD.quantity_available} kg
        </p>
        <p>
          <strong>Location:</strong> {cropD.location}
        </p>
        <p>
          <strong>Farmer ID:</strong> {cropD.farmer_id}
        </p>

        {/* Centered button */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button
            onClick={() =>
              navigate("/addconfirms", {
                state: {
                  cropName: cropD.crop_name,
                  farmerId: cropD.farmer_id,
                  pricePerKg: cropD.price,
                },
              })
            }
            style={{
              padding: "10px 20px",
              backgroundColor: "#36c54eff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Add Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bcropcard;