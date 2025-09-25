import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './Alerts.css';
import Nav from '../Nav/Nav';

function EditAlert() {
    const [form, setForm] = useState({ type: "", title: "", content: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/alerts/${id}`)
            .then(res => setForm(res.data.alert))
            .catch(() => setMessage("Failed to load alert."));
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/alerts/${id}`, form);
            setMessage("Alert updated!");
            setTimeout(() => {
                navigate('/alerts');
            }, 1000);
        } catch {
            setMessage("Failed to update alert.");
        }
    };

    return (
        <div>
            <Nav />
        <div className="add-alert-container">
            <h2>Edit Alert</h2>
            <form onSubmit={handleSubmit}>
                <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required />
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
                <button type="submit">Update Alert</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
}

export default EditAlert;