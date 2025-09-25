import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        cropname: "",
        plan: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const sendRequest = async () => {
        const res = await axios.post("http://localhost:5000/plan", {
            cropname: user.cropname,
            plan: user.plan,
        });
        return res.data;
    };

    // ✅ Add handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload
        try {
            await sendRequest();
            alert("Registered successfully!");
            navigate("/Login"); // redirect after success
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-side">
                <h1 className="signup-title">WELCOME !</h1>
            </div>
            <div className="register-form-container">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2>New user?</h2>
                    <p>Use the form below to create your account.</p>

                    <input
                        type="text"
                        name="cropname"  // ✅ fixed here
                        placeholder="Enter cropname"
                        value={user.cropname}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="text"  // ✅ changed from "plan"
                        name="plan"
                        placeholder="Enter plan"
                        value={user.plan}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="terms-checkbox">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">Agreed to Terms and Conditions</label>
                    </div>

                    <button type="submit" className="signup-btn">Sign Up</button>

                    <div className="login-link">
                        Have an account? <Link to="/Login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
