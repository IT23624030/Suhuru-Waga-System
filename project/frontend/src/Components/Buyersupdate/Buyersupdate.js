import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import Bfooter from "../Bfooter/Bfooter";
import Bheader from '../Bheader/Bheader';
import "./Buyerupdate.css";


function Buyersupdate() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  // Fetch buyer data by ID
  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/usersby/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.user));
    };
    fetchHandler();
  }, [id]);

  // Update request
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/usersby/${id}`, {
        buyerid: String(inputs.buyerid),
        firstname: String(inputs.firstname),
        lastname: String(inputs.lastname),
        organization: String(inputs.organization),
        gmail: String(inputs.gmail),
        contactNumber: Number(inputs.contactNumber),
        address: String(inputs.address),
      })
      .then((res) => res.data);
  };

  // Handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest();

      // ✅ Popup alert after successful update
      alert("Buyer updated successfully!");

      // Redirect to buyer profiles
      history('/bprofiles');
    } catch (err) {
      console.error(err);
      alert("Failed to update buyer. Please try again.");
    }
  };

  return (
    <div>
      <Bheader />

      <div className="byupage-wrapper">
        <div className="byuupdate-form-container">
          <form onSubmit={handleSubmit} className="byuupdate-form">
            <h1>Buyer Updated Form </h1>

            <div className="byuform-row">
              <label>Buyer NIC</label>
              <input
                type="text"
                name="buyerid"
                onChange={handleChange}
                value={inputs.buyerid || ""}
                readOnly
              />
            </div>

            <div className="byuform-row">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                onChange={handleChange}
                value={inputs.firstname || ""}
                required
              />
            </div>

            <div className="byuform-row">
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                onChange={handleChange}
                value={inputs.lastname || ""}
                required
              />
            </div>

            <div className="byuform-row">
              <label>Company Name</label>
              <input
                type="text"
                name="organization"
                onChange={handleChange}
                value={inputs.organization || ""}
                required
              />
            </div>

            <div className="byuform-row">
              <label>Email</label>
              <input
                type="text"
                name="gmail"
                onChange={handleChange}
                value={inputs.gmail || ""}
                required
              />
            </div>

            <div className="byuform-row">
              <label>Contact Number</label>
              <input
                type="number"
                name="contactNumber"
                onChange={handleChange}
                value={inputs.contactNumber || ""}
                required
              />
            </div>

            <div className="byuform-row">
              <label>Address</label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                value={inputs.address || ""}
                required
              />
            </div>

            <div className="byuform-actions">
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>

      <Bfooter />
    </div>
  );
}

export default Buyersupdate;