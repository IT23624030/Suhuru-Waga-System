// Alert.js (Updated)

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./Alerts.css";

// The onDelete prop is now expected
function Alert(props) {
    const { type, title, content, _id } = props.alert;

    // Use async/await for cleaner code
    const deleteHandler = async () => {
        try {
            await axios.delete(`http://localhost:5000/alerts/${_id}`);
            // Call the onDelete prop to update the state in the parent component
            props.onDelete(_id);
        } catch (error) {
            console.error("Error deleting alert:", error);
        }
    };

    const getAlertTypeColor = (alertType) => {
        const lowerCaseType = alertType.toLowerCase();
        if (lowerCaseType.includes("weather")) {
            return "weather";
        } else if (lowerCaseType.includes("disease")) {
            return "disease";
        }
        return "default";
    };

    const typeClass = getAlertTypeColor(type);

    return (
        <div>
            <p className={`alert-type ${typeClass}`}>{type}</p>
            <h3>Title: {title}</h3>
            <p>Content: {content}</p>
            <div className="alert-actions">
                <Link to={`/edit-alert/${_id}`} className="edit-button">Edit</Link>
                <button onClick={deleteHandler} className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default Alert;