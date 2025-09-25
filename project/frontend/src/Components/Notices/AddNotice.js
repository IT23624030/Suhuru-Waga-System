import React from 'react'
import Nav from '../Nav/Nav'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './AddNotice.css'; // Import the new CSS file

function AddNotice() {
    const history = useNavigate();
    const [inputs, setInputs] = React.useState({
        type: '',
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        setInputs((prevInputs) => ({ ...prevInputs, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputs);
        sendRequest().then(() => {
            history('../notices');
        });
    }

    const sendRequest = async () => {
        await axios.post('http://localhost:5000/notices', inputs).then(res => res.data);
    }

    return (
        <div>
            <Nav />
            <div className="add-notice-container">
                <div className="add-notice-hero">
                    <div className="Nhero-overlay">
                        <h1>Add New Notice</h1>
                    </div>
                </div>
                <div className="add-notice-form-container">
                    <form onSubmit={handleSubmit} className="add-notice-form">
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <input
                                id="type"
                                type="text"
                                placeholder="e.g., Event, Announcement"
                                name="type"
                                value={inputs.type}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter the title of the notice"
                                name="title"
                                value={inputs.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                placeholder="Write the notice content here..."
                                name="content"
                                value={inputs.content}
                                onChange={handleChange}
                                rows="6"
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Add Notice</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddNotice;