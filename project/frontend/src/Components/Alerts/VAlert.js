import React from 'react';
import "./VAlerts.css";

function VAlert(props) {
    const { type, title, content } = props.alert;

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
        </div>
    );
}

export default VAlert;