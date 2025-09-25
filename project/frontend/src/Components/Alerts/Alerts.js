// Alerts.js (Updated)

import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "./Alert";
import './Alerts.css';
import Nav from '../Nav/Nav';

const URL = "http://localhost:5000/alerts";

const fetchAlerts = async () => {
    try {
        return await axios.get(URL).then((response) => response.data);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return { alerts: [] };
    }
};

const benefitsText = "   Timely updates, Easy access to vital information, and Efficient communication.";

function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [typingText, setTypingText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAlerts().then((data) => setAlerts(data.alerts));
    }, []);

    useEffect(() => {
        let i = 0;
        setTypingText(''); 
        const typingEffect = setInterval(() => {
            if (i < benefitsText.length) {
                setTypingText((prev) => prev + benefitsText.charAt(i));
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 50); 
        return () => clearInterval(typingEffect);
    }, []);

    // New delete handler function
    const deleteAlertHandler = (id) => {
        setAlerts(alerts.filter(alert => alert._id !== id));
    };

    const filteredAlerts = alerts.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Nav />
            <div className="alerts-hero-image">
                <div className="hero-text-container">
                    <h1 className="hero-title">Alerts: Disease and Weather warnings</h1>
                    <div className="typing-container">
                        <span className="typing-text">{typingText}</span>
                    </div>
                </div>
            </div>
            <div className="alerts-container">
                <div className="alerts-header">
                    <h1>Manage Alerts</h1>
                    <a href="/add-alert" className="add-alert-link">Add Alert</a>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search alerts..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="alert-list">
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map((alert, i) => (
                            <div key={i} className="alert-card">
                                {/* Pass the new handler function */}
                                <Alert alert={alert} onDelete={deleteAlertHandler} />
                            </div>
                        ))
                    ) : (
                        <p className="no-alerts-message">No alerts to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Alerts;