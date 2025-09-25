import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../Nav/Nav';
import axios from 'axios';
import './UpdateNotice.css'; // Import the new CSS file

function UpdateNotice() {
    const [inputs, setInputs] = React.useState({});
    const history = useNavigate();
    const id = useParams().id;

    React.useEffect(() => {
        const fetchNotice = async () => {
            const response = await axios.get(`http://localhost:5000/notices/${id}`);
            setInputs(response.data);
        };
        fetchNotice();
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/notices/${id}`, inputs).then(res => res.data);
    };

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

    return (
        <div> 
            <Nav />
        <div className="update-notice-container">
            
            <div className="update-notice-hero">
                <div className="Nhero-overlay">
                    <h1>Update Notice</h1>
                </div>
            </div>
            <div className="update-notice-form-container">
                <form className="update-notice-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <input
                            id="type"
                            type="text"
                            name="type"
                            value={inputs.type}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={inputs.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={inputs.content}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="submit-button">Update Notice</button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default UpdateNotice;