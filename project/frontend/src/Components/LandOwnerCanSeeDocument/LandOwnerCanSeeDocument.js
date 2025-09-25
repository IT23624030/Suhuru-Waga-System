import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import DulaNav from '../DulaNav/DulaNav';




function LandOwnerCanSeeDocument() {
    const navigate = useNavigate();
    // State variables for the new land form title and file
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    // State to store the list of available land forms
    const [landForms, setLandForms] = useState([]);
    // State for user messages (success/error)
    const [message, setMessage] = useState('');

    // Fetch the list of land forms when the component mounts
    useEffect(() => {
        fetchLandForms();
    }, []);

    // Function to fetch the list of land forms from the backend
    const fetchLandForms = async () => {
        try {
            const res = await axios.get("http://localhost:5000/landforms/list");
            setLandForms(res.data.landForms);
        } catch {
            setLandForms([]);
        }
    };

    // Event handlers for input changes
    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleTitleChange = (e) => setTitle(e.target.value);

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate that both title and file are provided
        if (!file || !title) {
            setMessage("Please provide a land form title and select a file.");
            return;
        }
        // Create a new FormData object to send the file and title
        const formData = new FormData();
        formData.append("landFormFile", file);
        formData.append("title", title);

        try {
            await axios.post("http://localhost:5000/landforms/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage("Land form uploaded successfully!");
            // Clear the form inputs
            setTitle('');
            setFile(null);
            // Refresh the list of land forms
            fetchLandForms();
        } catch {
            setMessage("Upload failed.");
        }
    };

    return (
        <div>
            


            
            {/* The Nav component is now part of this file */}
              {/* ✅ Navigation Bar added here */}
      <nav className="land-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-logo">🌾</span>
            <span className="brand-name">SuhuruWaga</span>
          </div>

          <div className="navbar-menu">
            <button className="nav-item" onClick={() => navigate('/home2')}>🏠 Home</button>
            <button className="nav-item" onClick={() => navigate('/Features')}>⭐ Features</button>
            <button className="nav-item" onClick={() => navigate('/Calculator')}>🧮 Calculator</button>
            <button className="nav-item" onClick={() => navigate('/CropAdvisor')}>🌱 Crop Advisor</button>
            <button className="nav-item" onClick={() => navigate('/about')}>ℹ️ About</button>
            <button className="nav-item" onClick={() => navigate('/contact')}>📞 Contact</button>
            <button className="nav-item" onClick={() => navigate('/View')}>🪃 View</button>
            <button className="nav-item" onClick={() => navigate('/land')}>🍁 Land</button>
            <button className="nav-item" onClick={() => navigate('/SriLankaMap')}>🌎 Map</button>
            
          </div>

          
        </div>
      </nav>
      {/* ✅ End of Nav */}
            {/* Styles for this component are in a style block to avoid external dependencies */}
           {/* <style>
                {`
                .forms-hero-image {
                    background-image: url('https://placehold.co/1200x400/2980b9/ffffff?text=Land+Records+Portal');
                    background-size: cover;
                    background-position: center;
                    height: 250px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    text-align: center;
                }
                .forms-hero-image h1 {
                    font-size: 3rem;
                    margin: 0;
                }
                .forms-container {
                    padding: 2rem;
                    max-width: 800px;
                    margin: 2rem auto;
                    background-color: #f4f6f9;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .forms-upload-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .forms-input {
                    padding: 0.75rem;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                }
                .forms-button {
                    background-color: #3498db;
                    color: white;
                    padding: 0.75rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .forms-button:hover {
                    background-color: #2980b9;
                }
                .forms-message-box {
                    padding: 1rem;
                    background-color: #ecf0f1;
                    border-radius: 5px;
                    margin-top: 1rem;
                    text-align: center;
                }
                .forms-list-section {
                    margin-top: 2rem;
                }
                .forms-list {
                    list-style-type: none;
                    padding: 0;
                }
                .forms-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin-bottom: 10px;
                }
                .forms-title {
                    font-weight: bold;
                }
                .forms-download-btn {
                    background-color: #27ae60;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                }
                .forms-download-btn:hover {
                    background-color: #2ecc71;
                }
                .forms-no-forms {
                    text-align: center;
                    font-style: italic;
                    color: #7f8c8d;
                }
                `}
            </style>*/}

            
            <div className="forms-hero-image">
                
                
                <h1>Document Center</h1>
            </div>
            <div className="forms-container">
                <h2>Upload Land Form</h2>
                <form className="forms-upload-form" onSubmit={handleSubmit}>
                    <input
                        className="forms-input"
                        type="text"
                        placeholder="Land Form Title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                    <input
                        className="forms-input"
                        type="file"
                        name="landFormFile"
                        onChange={handleFileChange}
                        required
                    />
                    <button className="forms-button" type="submit">Upload Land Form</button>
                </form>
                {message && <p className="forms-message-box">{message}</p>}

                <div className="forms-list-section">
                    <h2>Available Land Forms</h2><br />
                    {landForms.length === 0 ? (
                        <p className="forms-no-forms">No land forms uploaded yet.</p>
                    ) : (
                        <ul className="forms-list">
                            {landForms.map((f) => (
                                <li key={f._id} className="forms-item">
                                    <span className="forms-title">{f.title}</span>
                                    <a
                                        href={`http://localhost:5000/landformfiles/${f.file}`}
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
        </div>
    );
}

export default LandOwnerCanSeeDocument;
