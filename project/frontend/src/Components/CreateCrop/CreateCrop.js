import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateCrop.css"; // Create a similar CSS file for styling
import Nav from "../Home/Nav/Nav2";
function CreateCrop() {
  const [formData, setFormData] = useState({
    district: "",
    start: "",
    whether: "",
    crops: "",
  });

  const [cropsList, setCropsList] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch all crops
  const fetchCrops = async () => {
    try {
      const res = await axios.get("http://localhost:5000/crops");
      setCropsList(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create new crop
  const createCrop = async () => {
    try {
      const res = await axios.post("http://localhost:5000/crop", formData);
      return res.data;
    } catch (err) {
      console.error("Error creating crop:", err);
      throw err;
    }
  };

  // Update existing crop
  const updateCrop = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/crop/${id}`, formData);
      return res.data;
    } catch (err) {
      console.error("Error updating crop:", err);
      throw err;
    }
  };

  // Delete crop
  const deleteCrop = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/crop/${id}`);
      fetchCrops();
    } catch (err) {
      console.error("Error deleting crop:", err);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCrop(editId);
        alert("✅ Crop updated successfully");
      } else {
        await createCrop();
        alert("✅ Crop created successfully");
      }
      setFormData({ district: "", start: "", whether: "", crops: "" });
      setEditId(null);
      fetchCrops();
    } catch (err) {
      alert("⚠️ Something went wrong. Check console.");
    }
  };

  // Handle edit button
  const handleEdit = (crop) => {
    setFormData({
      district: crop.district,
      start: crop.start,
      whether: crop.whether,
      crops: crop.crops,
    });
    setEditId(crop._id);
  };

  return (
   <div>
      <Nav />
    <div className="crop-container">
      <div className="crop-hero-image">
        <div className="crop-text-container">
          <h1 className="crop-titleros">Crop  Management</h1>
          <p className="crop-subtitle">
            Create, Edit, and Manage Crops Efficiently.
          </p>
        </div>
      </div>

    <div className="crop-container">
      <h1> </h1>

      <form className="crop-form" onSubmit={handleSubmit}>
        <h2>{editId ? "Edit Crop" : "New Crop"}</h2>

        <input
          type="text"
          name="district"
          placeholder="Enter District"
          value={formData.district}
          onChange={handleInputChange}
          required
        />

        <input
          type="text"
          name="start"
          placeholder="Enter Start Month"
          value={formData.start}
          onChange={handleInputChange}
          required
        />

        <input
          type="text"
          name="whether"
          placeholder="Enter Weather"
          value={formData.whether}
          onChange={handleInputChange}
          required
        />

        <input
          type="text"
          name="crops"
          placeholder="Enter Crop Name"
          value={formData.crops}
          onChange={handleInputChange}
          required
        />

        <button type="submit">
          {editId ? "Update Crop" : "Save Crop"}
        </button>
      </form>

      <hr />

      <h2>Existing Crops</h2>
      <table className="crop-table">
        <thead>
          <tr>
            <th>District</th>
            <th>Start</th>
            <th>Weather</th>
            <th>Crop</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cropsList.map((crop) => (
            <tr key={crop._id}>
              <td>{crop.district}</td>
              <td>{crop.start}</td>
              <td>{crop.whether}</td>
              <td>{crop.crops}</td>
              <td>
                <button onClick={() => handleEdit(crop)}>Edit</button>
                <button onClick={() => deleteCrop(crop._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
}

export default CreateCrop;
