import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Home/Footer/Footer";
import "./CreatePlan.css";
import Nav from "../Home/Nav/Nav2";


function CreatePlan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropname: "",
    weather:"",
    plan: "",
  });

  const [plans, setPlans] = useState([]); // all CreatePlans
  const [editId, setEditId] = useState(null); // track which plan is being edited

  // Fetch all CreatePlans from backend
  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:5000/createPlans");
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Create new CreatePlan
  const createPlan = async () => {
    try {
      const res = await axios.post("http://localhost:5000/createPlan", formData);
      return res.data;
    } catch (err) {
      console.error("Error creating plan:", err);
      throw err;
    }
  };

  // Update existing CreatePlan
  const updatePlan = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/createPlan/${id}`, formData);
      return res.data;
    } catch (err) {
      console.error("Error updating plan:", err);
      throw err;
    }
  };

  // Delete a CreatePlan
  const deletePlan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/createPlan/${id}`);
      fetchPlans(); // refresh list
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updatePlan(editId);
        alert("✅ Plan updated successfully");
      } else {
        await createPlan();
        alert("✅ Plan created successfully");
      }
      setFormData({ cropname: "", plan: "" ,weather:""});
      setEditId(null);
      fetchPlans();
    } catch (err) {
      alert("⚠ Something went wrong. Check console for details.");
    }
  };

  // Handle edit button click
  const handleEdit = (plan) => {
    setFormData({ cropname: plan.cropname, plan: plan.plan ,weather: plan.weather});
    setEditId(plan._id);
  };

  return (
    <div>
      <Nav />
    <div className="plan-container">
      <div className="plan-hero-image">
        <div className="hero-text-container">
          <h1 className="hero-title">Crop Plans Management</h1>
          <p className="hero-subtitle">
            Create, Edit, and Manage your crop plans efficiently.
          </p>
        </div>
      </div>
    
    <div className="plan-container">
      <div className="plan-side">
        <h1 className="plan-title"> </h1>
      </div>

      <div className="plan-form-container">
        <form className="plan-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Edit Plan" : " Add New Plan"}</h2>
          <p>Enter details below  :-</p>

          <input
            type="text"
            name="cropname"
            placeholder="Enter Crop Name"
            value={formData.cropname}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="weather"
            placeholder="Enter weather"
            value={formData.weather}
            onChange={handleInputChange}
            required
          />

          <textarea
            name="plan"
            placeholder="Enter Plan Description"
            value={formData.plan}
            onChange={handleInputChange}
            rows="5"
            required
          ></textarea>

          <button type="submit" className="plan-btn">
            {editId ? "Update Plan" : "Save Plan"}
          </button>
        </form>

        <hr />

        <h2>Existing Plans:-</h2>
<table className="plan-table">
  <thead>
    <tr>
      <th>Crop Name</th>
      <th>Weather</th>
      <th>Description</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {plans.map((plan) => (
      <tr key={plan._id}>
        <td>{plan.cropname}</td>
        <td>{plan.weather}</td>
        <td>{plan.plan}</td>
        <td>
          <button className="table-btn" onClick={() => handleEdit(plan)}>
            Edit
          </button>
          <button
            className="table-btn delete"
            onClick={() => deletePlan(plan._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      </div>
       
    </div>
    </div>
    </div>
  );
}

export default CreatePlan;