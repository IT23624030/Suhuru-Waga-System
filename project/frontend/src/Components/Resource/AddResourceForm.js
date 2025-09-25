import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AddResourceForm.css";
import Navbar from "./Nav/Nav2";
import Footer from "./Footer/Footer";

function AddResourceForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Retrieve user info from localStorage
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userId = user?._id || null;
  const providerName = user?.fullname || null;

  const [formData, setFormData] = useState({
    name: "",
    category: "equipment",
    description: "",
    totalUnits: 0,
    availableUnits: 0,
    baseRate: 0,
    maxPriceCeiling: 0,
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.add("arf-body");
    return () => document.body.classList.remove("arf-body");
  }, []);

  // Auto-calculate max price ceiling
  useEffect(() => {
    const margin = 0.2;
    if (formData.baseRate > 0) {
      setFormData(prev => ({
        ...prev,
        maxPriceCeiling: parseFloat((prev.baseRate * (1 + margin)).toFixed(2)),
      }));
    } else {
      setFormData(prev => ({ ...prev, maxPriceCeiling: 0 }));
    }
  }, [formData.baseRate]);

  const validateForm = () => {
    if (!providerName) {
      setError("Provider information is not available. Please log in again.");
      return false;
    }
    if (!formData.name.trim()) {
      setError("Name is required.");
      return false;
    }
    if (formData.totalUnits < 0 || formData.availableUnits < 0) {
      setError("Units cannot be negative.");
      return false;
    }
    if (formData.availableUnits > formData.totalUnits) {
      setError("Available units cannot exceed total units.");
      return false;
    }
    if (formData.baseRate <= 0) {
      setError("Base Rate must be greater than zero.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ["totalUnits", "availableUnits", "baseRate", "maxPriceCeiling"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, imageUrl: file.name })); // Just sending file name for now
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      imageUrl: formData.imageUrl || "",
      providerName: providerName,
      availability: {
        totalUnits: formData.totalUnits,
        availableUnits: formData.availableUnits,
      },
      pricing: {
        baseRate: formData.baseRate,
        maxPriceCeiling: formData.maxPriceCeiling,
      },
      metadata: {
        createdBy: userId,
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
    };

    try {
      const res = await fetch("http://localhost:5000/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add resource");

      // Include local preview for immediate display
      const newResource = { ...data, imagePreview };

      // Show alert before redirect
      alert("Your resource has been added successfully!");
      navigate("/resources", { state: { newResource } }); // Pass newResource with local preview
    } catch (err) {
      setError("Could not add resource. " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="arf-page">
      <Navbar />
      <div className={`arf-form-container ${imagePreview ? "arf-with-image" : ""}`}>
        <div className="arf-form-scrollable">
          <h2 className="arf-form-title">Add New Resource</h2>

          {!imagePreview && (
            <div className="arf-image-upload-section" onClick={() => fileInputRef.current?.click()}>
              <label className="arf-image-upload-label">Select Image:</label>
              <div className="arf-image-upload-box">
                <span className="arf-plus-icon">+</span>
                <p>Add image</p>
              </div>
            </div>
          )}

          {imagePreview && (
            <div className="arf-image-actions">
              <button type="button" className="arf-btn arf-btn-replace" onClick={() => fileInputRef.current?.click()}>Replace Image</button>
              <button type="button" className="arf-btn arf-btn-remove" onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, imageUrl: "" })); }}>Remove Image</button>
            </div>
          )}

          <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />

          <form onSubmit={handleSubmit} className="arf-form">
            <label className="arf-label">
              Name:<br />
              <input name="name" value={formData.name} onChange={handleChange} className="arf-input" required />
            </label>

            <label className="arf-label">
              Category:<br />
              <select name="category" value={formData.category} onChange={handleChange} className="arf-select">
                <option value="equipment">Equipment</option>
                <option value="supply">Supply</option>
                <option value="labor">Labor</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="arf-label">
              Description:<br />
              <textarea name="description" value={formData.description} onChange={handleChange} className="arf-textarea" />
            </label>

            <label className="arf-label">
              Total Units:<br />
              <input type="number" name="totalUnits" min="0" value={formData.totalUnits} onChange={handleChange} className="arf-input" />
            </label>

            <label className="arf-label">
              Available Units:<br />
              <input type="number" name="availableUnits" min="0" value={formData.availableUnits} onChange={handleChange} className="arf-input" />
            </label>

            <label className="arf-label">
              Base Rate (Rs.):<br />
              <input type="number" name="baseRate" min="0.01" step="0.01" value={formData.baseRate} onChange={handleChange} className="arf-input" required />
            </label>

            <label className="arf-label">
              Max Price Ceiling (Rs.):<br />
              <input type="number" name="maxPriceCeiling" min={formData.baseRate} step="0.01" value={formData.maxPriceCeiling} disabled className="arf-input arf-input-disabled" />
            </label>

            {error && <p className="arf-error-msg">{error}</p>}

            <button type="submit" className="arf-btn-submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
            <button type="button" className="arf-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          </form>
        </div>

        {imagePreview && (
          <div className="arf-image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AddResourceForm;
