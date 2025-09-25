import React from 'react';
import './LandCard.css';

const LandCard = ({ land, index, onBidClick, onViewBidsClick, onEditClick, onDeleteClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isBiddingActive = land.isBiddingActive;
  const daysRemaining = land.daysRemaining;

  return (
    <div className="land-card-wrapper">
      <div className="land-card">
        {/* Land Image */}
        <div className="land-card-image">
          <img src={land.imageUrl} alt={`${land.ownerName}'s land`} />
          <div className="land-card-overlay">
            <span className={`status-badge ${isBiddingActive ? 'status-active' : 'status-closed'}`}>
              {isBiddingActive ? `${daysRemaining} days left` : 'Bidding Closed'}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="land-card-content">
          {/* Header */}
          <div className="land-card-header">
            <h3 className="land-owner">{land.ownerName}</h3>
            <p className="land-amount">{formatCurrency(land.amount)}</p>
          </div>

          {/* Land Details */}
          <div className="land-details">
            <div className="land-detail">
              <span className="detail-icon">📍</span>
              <span className="detail-text">
                {land.location?.address || 'Unknown Location'}
              </span>
            </div>

            <div className="land-detail">
              <span className="detail-icon">🌾</span>
              <span className="detail-text">
                {land.area} acres • {land.soilType} soil
              </span>
            </div>

            {land.resources && land.resources.length > 0 && (
              <div className="land-resources">
                <span className="detail-icon">⚡</span>
                <div className="resources-list">
                  {land.resources.slice(0, 3).map((resource, idx) => (
                    <span key={idx} className="resource-chip-game">
                      {resource}
                    </span>
                  ))}
                  {land.resources.length > 3 && (
                    <span className="resource-chip-game">
                      +{land.resources.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="land-description">
            <p>
              {land.description && land.description.length > 100
                ? `${land.description.substring(0, 100)}...`
                : land.description || 'No description available'}
            </p>
          </div>

          {/* Stats */}
          <div className="land-stats">
            <div className="stat">
              <span className="stat-label">Total Bids</span>
              <span className="stat-value">{land.bids?.length || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Created</span>
              <span className="stat-value">{formatDate(land.createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="land-card-actions">
            <button
              className={`btn ${isBiddingActive ? 'btn-primary' : 'btn-disabled'}`}
              onClick={() => onBidClick(land)}
              disabled={!isBiddingActive}
            >
              {isBiddingActive ? '💰 Place Bid' : '🔒 Bidding Closed'}
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => onViewBidsClick(land)}
            >
              👥 View Bids
            </button>
          </div>

          {/* Admin Buttons */}
          <div className="land-card-admin-actions">
            <button
              className="btn btn-edit"
              onClick={() => onEditClick(land)}
              title="Edit Land"
            >
              ✏ Edit
            </button>

            <button
              className="btn btn-delete"
              onClick={() => onDeleteClick(land)}
              title="Delete Land"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandCard;