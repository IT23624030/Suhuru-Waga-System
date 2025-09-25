import React, { useState, useEffect } from "react";
import axios from "axios";
import VAlert from "./VAlert";
import './VAlerts.css';
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import Footer from "../Home/Footer/Footer";

const URL = "http://localhost:5000/alerts";

const fetchAlerts = async () => {
    try {
        return await axios.get(URL).then((response) => response.data);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return { alerts: [] };
    }
};

const benefitsText = "Timely updates, Easy access to vital information, and Efficient communication.";

function VAlerts() {
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

    const filteredAlerts = alerts.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Nav />
            <div className="alerts-hero-image">
                <Navi />
                <div className="hero-text-container">
                    <h1 className="hero-title">Alerts: Disease and Weather warnings</h1>
                    <div className="typing-container">
                        <span className="typing-text">{typingText}</span>
                    </div>
                </div>
            </div>
            <div className="alerts-container">
                <div className="alerts-header">
                    <h1>Alerts</h1>
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
                                <VAlert alert={alert} />
                            </div>
                        ))
                    ) : (
                        <p className="no-alerts-message">No alerts to display.</p>
                    )}
                </div>
            </div>
            <Footer /> 
        </div>
    );
}

export default VAlerts;