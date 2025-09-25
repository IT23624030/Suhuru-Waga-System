import React, { useState, useEffect } from "react";
import axios from "axios";
import './Forms.css';
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import Footer from "../Home/Footer/Footer";

function VForms() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [forms, setForms] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const res = await axios.get("http://localhost:5000/forms/list");
            setForms(res.data.forms);
        } catch {
            setForms([]);
        }
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            setMessage("Please provide a form title and select a file.");
            return;
        }
        const formData = new FormData();
        formData.append("formFile", file);
        formData.append("title", title);

        try {
            await axios.post("http://localhost:5000/forms/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage("Form uploaded!");
            setTitle('');
            setFile(null);
            fetchForms();
        } catch {
            setMessage("Upload failed.");
        }
    };

    return (
        <div>
            <Nav />
            <div className="forms-hero-image">
                <Navi />
                <h1>Your Government Form Center</h1>
            </div>
            <div className="forms-container">
                <h2>Send Form</h2>
                <form className="forms-upload-form" onSubmit={handleSubmit}>
                    <input
                        className="forms-input"
                        type="text"
                        placeholder="Form Title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                    <input
                        className="forms-input"
                        type="file"
                        name="formFile"
                        onChange={handleFileChange}
                        required
                    />
                    <button className="forms-button" type="submit">Send Form</button>
                </form>
                {message && <p className="forms-message-box">{message}</p>}

                <div className="forms-list-section">
                    <h2>Available Forms</h2><br />
                    {forms.length === 0 ? (
                        <p className="forms-no-forms">No forms uploaded yet.</p>
                    ) : (
                        <ul className="forms-list">
                            {forms.map((f) => (
                                <li key={f._id} className="forms-item">
                                    <span className="forms-title">{f.title}</span>
                                    <a
                                        href={`http://localhost:5000/formfiles/${f.file}`}
                                        className="forms-download-btn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footer /> 
        </div>
    );
}

export default VForms;