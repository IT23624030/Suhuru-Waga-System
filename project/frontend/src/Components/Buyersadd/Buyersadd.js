import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Bfooter from "../Bfooter/Bfooter";
import Bheader from "../Bheader/Bheader";
import "./Buyersadd.css";

function Buyersadd() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    buyerid: "",
    firstname: "",
    lastname: "",
    organization: "",
    gmail: "",
    contactNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit Buyer NIC to 12 characters
    if (name === "buyerid" && value.length > 12) return;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = async () => {
    const errors = {};

    // NIC length validation
    if (inputs.buyerid.length !== 12) {
      errors.buyerid = "Buyer NIC must be exactly 12 characters";
    } else {
      // Check for duplicate NIC via backend
      try {
        const res = await axios.get(`http://localhost:5000/usersby/check-nic/${inputs.buyerid}`);
        if (res.data.exists) errors.buyerid = "Buyer NIC already exists";
      } catch (err) {
        console.error("NIC check error:", err);
      }
    }

    // Email validation
    if (!inputs.gmail.includes("@") || !inputs.gmail.includes(".")) {
      errors.gmail = "Email must include '@' and '.'";
    }

    // Contact number validation
    if (!/^\d{10}$/.test(inputs.contactNumber)) {
      errors.contactNumber = "Contact number must be exactly 10 digits";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = await validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post("http://localhost:5000/usersby", {
        buyerid: String(inputs.buyerid),
        firstname: String(inputs.firstname),
        lastname: String(inputs.lastname),
        organization: String(inputs.organization),
        gmail: String(inputs.gmail),
        contactNumber: Number(inputs.contactNumber),
        address: String(inputs.address),
      });

      alert("Buyer added successfully!");  

      // Clear the form
      setInputs({
        buyerid: "",
        firstname: "",
        lastname: "",
        organization: "",
        gmail: "",
        contactNumber: "",
        address: "",
      });

      history("/bprofiles");
    } catch (err) {
      console.error(err);
      alert("Failed to add buyer. Please try again.");
    }
  };

  return (
    <div>
      <Bheader />
      <div className="bypage-container">
        <main className="bform-container">
          <form onSubmit={handleSubmit} className="bbuyer-form">
            <h1> Buyer Registration Form</h1>

            <label>Buyer NIC</label>
            <input
              type="text"
              name="buyerid"
              onChange={handleChange}
              value={inputs.buyerid}
              required
            />
            {errors.buyerid && <span className="error">{errors.buyerid}</span>}

            <label>First Name </label>
            <input
              type="text"
              name="firstname"
              onChange={handleChange}
              value={inputs.firstname}
              required
            />

            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              onChange={handleChange}
              value={inputs.lastname}
              required
            />

            <label>Company Name</label>
            <input
              type="text"
              name="organization"
              onChange={handleChange}
              value={inputs.organization}
              required
            />

            <label>Gmail</label>
            <input
              type="email"
              name="gmail"
              onChange={handleChange}
              value={inputs.gmail}
              required
            />
            {errors.gmail && <span className="error">{errors.gmail}</span>}

            <label>Contact Number</label>
            <input
              type="number"
              name="contactNumber"
              onChange={handleChange}
              value={inputs.contactNumber}
              required
            />
            {errors.contactNumber && (
              <span className="error">{errors.contactNumber}</span>
            )}

            <label>Address</label>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              value={inputs.address}
              required
            />

            <label className="bcheckbox-label">
              <input type="checkbox" required /> Agree all Terms & Conditions
            </label>

            <button type="submit" className="bbtn-submit">
              Submit
            </button>
          </form>
        </main>
      </div>
      <Bfooter />
    </div>
  );
}

export default Buyersadd;