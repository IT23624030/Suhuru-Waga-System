import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import './AddUser.css';

function AddUser() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        fullname: "",
        age: "",
        gender: "",
        NIC: "",
        contact_number: "",
        email: "",
        address: "",
        distric: "",
        city: "",
        experience: "",
        agri_activities: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (inputs.password !== inputs.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Check if contact_number has exactly 10 digits
    const contactStr = String(inputs.contact_number);
    if (contactStr.length !== 10 || !/^\d+$/.test(contactStr)) {
        alert("Contact number must be exactly 10 digits.");
        return;
    }

    // Check if email contains @ symbol
    if (!inputs.email.includes("@")) {
        alert("Please enter a valid email address with '@'.");
        return;
    }

    // Check password length (exactly 8 characters)
    if (inputs.password.length !== 8) {
        alert("Password must be exactly 8 characters long.");
        return;
    }

        try {
            const data = await sendRequest();
            if (data.status === "ok") {
                alert("Registration successful!");
                navigate('/Login');
            } else {
                alert(data.message || "Registration failed.");
            }
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert("A user with this email or NIC already exists.");
            } else {
                alert("Registration failed due to server error.");
            }
            console.error("Registration error:", err);
        }
    };

    const sendRequest = async () => {
        const response = await axios.post("http://localhost:5000/users", {
            fullname: inputs.fullname,
            age: Number(inputs.age),
            gender: inputs.gender,
            NIC: inputs.NIC,
            contact_number: Number(inputs.contact_number),
            email: inputs.email,
            address: inputs.address,
            distric: inputs.distric,
            city: inputs.city,
            experience: Number(inputs.experience),
            agri_activities: inputs.agri_activities,
            password: inputs.password,
        });
        return response.data;
    };

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <div className="signup-sidero">
                    <h1 className="signup-title">WELCOME!</h1>
                </div>
                <div className="register-form-containerr">
                    <form className="register-formro" onSubmit={handleSubmit}>
                        <h2>Create Profile</h2>
                        <p>Use the form below to create your account.</p>
<div className="input-group">
     <input type="text" name="fullname" placeholder="Full Name" value={inputs.fullname} onChange={handleChange} required />
</div>
                
                        <div className="input-groupro">
                            <input type="number" name="age" placeholder="Age" value={inputs.age} onChange={handleChange} required />
                            <input type="text" name="gender" placeholder="Gender" value={inputs.gender} onChange={handleChange} required />
                        </div>

                        <div className="input-groupro">
                            <input type="text" name="NIC" placeholder="NIC" value={inputs.NIC} onChange={handleChange} required />
                            <input type="number" name="contact_number" placeholder="Contact Number" value={inputs.contact_number} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />
                        </div>

                        <div className="input-groupro">
                            <input type="text" name="address" placeholder="Address" value={inputs.address} onChange={handleChange} required />
                            <input type="text" name="distric" placeholder="District" value={inputs.distric} onChange={handleChange} required />
                            <input type="text" name="city" placeholder="City" value={inputs.city} onChange={handleChange} required />
                        </div>

<div  className="input-group">
    <input type="number" name="experience" placeholder="Experience" value={inputs.experience} onChange={handleChange} required />
                        <input type="text" name="agri_activities" placeholder="Agricultural Activities" value={inputs.agri_activities} onChange={handleChange} required />
</div>
                        

                        <div className="input-groupro">
                            <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={inputs.confirmPassword} onChange={handleChange} required />
                        </div>

                        <button type="submit" className="signup-btn">Create Profile</button>

                        <div className="login-links">
                            Have an account? <Link to="/Login">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddUser;