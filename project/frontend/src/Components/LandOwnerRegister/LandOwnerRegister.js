import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import './LandOwnerRegister.css';

function LandOwnerRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        age: '',
        gender: '',
        NIC: '',
        contact_number: '',
        email: '',
        address: '',
        distric: '',
        city: '',
        experience: '',
        agri_activities: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
        if (!formData.age || formData.age < 18 || formData.age > 100) newErrors.age = 'Age must be between 18-100';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.NIC.trim()) newErrors.NIC = 'NIC is required';
        if (!formData.contact_number || formData.contact_number.length < 10) newErrors.contact_number = 'Valid contact number is required';
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.distric.trim()) newErrors.distric = 'District is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.experience || formData.experience < 0) newErrors.experience = 'Experience is required';
        if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const { confirmPassword, ...dataToSend } = formData;
            // Add userType for land owner
            dataToSend.userType = 'landowner';
            const response = await axios.post("http://localhost:5000/users", dataToSend);
            
            if (response.data.status === "ok") {
                alert("Land Owner registered successfully!");
                navigate("/Login");
            } else {
                alert(response.data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Nav />
            <div className="land-owner-register-container">
                <div className="register-header">
                    <h1>Land Owner Registration</h1>
                    <p>Join our platform to list and manage your properties</p>
                </div>

                <div className="register-form-container">
                    <form className="land-owner-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    className={errors.fullname ? 'error' : ''}
                                    placeholder="Enter your full name"
                                />
                                {errors.fullname && <span className="error-text">{errors.fullname}</span>}
                            </div>

                            <div className="form-group">
                                <label>Age *</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className={errors.age ? 'error' : ''}
                                    placeholder="Enter your age"
                                    min="18"
                                    max="100"
                                />
                                {errors.age && <span className="error-text">{errors.age}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Gender *</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={errors.gender ? 'error' : ''}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <span className="error-text">{errors.gender}</span>}
                            </div>

                            <div className="form-group">
                                <label>NIC Number *</label>
                                <input
                                    type="text"
                                    name="NIC"
                                    value={formData.NIC}
                                    onChange={handleInputChange}
                                    className={errors.NIC ? 'error' : ''}
                                    placeholder="Enter your NIC number"
                                />
                                {errors.NIC && <span className="error-text">{errors.NIC}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Contact Number *</label>
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                    className={errors.contact_number ? 'error' : ''}
                                    placeholder="Enter your contact number"
                                />
                                {errors.contact_number && <span className="error-text">{errors.contact_number}</span>}
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Address *</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={errors.address ? 'error' : ''}
                                placeholder="Enter your full address"
                                rows="3"
                            />
                            {errors.address && <span className="error-text">{errors.address}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>District *</label>
                                <input
                                    type="text"
                                    name="distric"
                                    value={formData.distric}
                                    onChange={handleInputChange}
                                    className={errors.distric ? 'error' : ''}
                                    placeholder="Enter your district"
                                />
                                {errors.distric && <span className="error-text">{errors.distric}</span>}
                            </div>

                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={errors.city ? 'error' : ''}
                                    placeholder="Enter your city"
                                />
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Experience (Years) *</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className={errors.experience ? 'error' : ''}
                                    placeholder="Years of experience in land ownership"
                                    min="0"
                                />
                                {errors.experience && <span className="error-text">{errors.experience}</span>}
                            </div>

                            <div className="form-group">
                                <label>Agricultural Activities</label>
                                <input
                                    type="text"
                                    name="agri_activities"
                                    value={formData.agri_activities}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Rice farming, Vegetable cultivation"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="Enter password (min 6 characters)"
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password *</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={errors.confirmPassword ? 'error' : ''}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="register-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registering...' : 'Register as Land Owner'}
                            </button>
                        </div>

                        <div className="login-link">
                            Already have an account? <Link to="/Login">Login here</Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LandOwnerRegister;
