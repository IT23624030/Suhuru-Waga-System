import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Alerts.css';
import Nav from '../Nav/Nav';

function AddAlert() {
    const [form, setForm] = useState({ type: "", title: "", content: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/alerts", form);
            setMessage("Alert added!");
            setTimeout(() => {
                navigate('/alerts');
            }, 500);
            setForm({ type: "", title: "", content: "" });
        } catch {
            setMessage("Failed to add alert.");
        }
    };

    return (
        <div>
            <Nav />
        <div className="add-alert-container">
            <h2>Add Alert</h2>
            <form onSubmit={handleSubmit}>
                <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required />
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
                <button type="submit">Add Alert</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
}

export default AddAlert;