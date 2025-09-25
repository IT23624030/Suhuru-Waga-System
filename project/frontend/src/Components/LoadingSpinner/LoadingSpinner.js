import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading lands", variant = "default" }) => {
  const renderSpinner = () => {
    if (variant === "modern") {
      return <div className="loading-modern" />;
    }
    return <div className="loading-spinner" />;
  };

  return (
    <div className={`loading-container ${variant === "success" ? "loading-success" : ""} ${variant === "error" ? "loading-error" : ""}`}>
      {renderSpinner()}
      <p className="loading-text">
        {message}<span className="loading-dots"></span>
      </p>
    </div>
  );
};

export default LoadingSpinner;
