import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewBidsModal.css';

const ViewBidsModal = ({ land, onClose }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/lands/${land._id}/bids`);
      
      if (response.data.success) {
        setBids(response.data.data);
        setStatus(response.data.status);
        setDaysRemaining(response.data.daysRemaining || 0);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bids/${land._id}/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchBids();
    fetchStats();
  }, [land._id]);

  const downloadReport = async (format) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bids/${land._id}/report/${format}`, {
        responseType: 'blob',
        timeout: 30000 // 30 seconds timeout
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `land-${land._id}-bids-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      let errorMessage = 'Failed to download report. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Land not found.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error occurred while generating the report.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const maskMobileNumber = (mobile) => {
    if (!mobile || mobile.length < 4) return mobile;
    return mobile.substring(0, 3) + '*'.repeat(mobile.length - 6) + mobile.substring(mobile.length - 3);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content view-bids-modal">
        <div className="modal-header">
          <h2 className="modal-title">Bidding Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Land Info */}
        <div className="land-summary">
          <div className="land-summary-image">
            <img src={land.imageUrl} alt="Land" />
          </div>
          <div className="land-summary-details">
            <h3>{land.ownerName}'s Land</h3>
            <p>📍 {land.location?.address || 'Unknown Location'}</p>
            <p>🌾 {land.area} acres • {land.soilType} soil</p>
            <p className="base-amount">Base Amount: {formatCurrency(land.amount)}</p>
            <div className="status-container">
              <span className={`status-badge ${status === 'Active' ? 'status-active' : 'status-closed'}`}>
                {status === 'Active' ? `${daysRemaining} days remaining` : 'Bidding Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bidding-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalBids}</div>
              <div className="stat-label">Total Bids</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatCurrency(stats.highestBid)}</div>
              <div className="stat-label">Highest Bid</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatCurrency(stats.averageBidAmount)}</div>
              <div className="stat-label">Average Bid</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.bidIncrease}%</div>
              <div className="stat-label">Increase</div>
            </div>
          </div>
        )}

        {/* Report Download - Always available */}
        <div className="report-section">
          <h4>Download Report</h4>
          <div className="report-buttons">
            <button
              className="btn btn-secondary download-btn"
              onClick={() => downloadReport('csv')}
              title="Download detailed CSV report for data analysis"
            >
              📊 Download CSV
            </button>
            <button
              className="btn btn-primary download-btn"
              onClick={() => downloadReport('pdf')}
              title="Download professional PDF report"
            >
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* Bids List */}
        <div className="bids-section">
          <h4>
            {status === 'Active' ? 'Current Bids' : 'Final Bids'} 
            {bids.length > 0 && <span className="bids-count">({bids.length})</span>}
          </h4>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : bids.length > 0 ? (
            <div className="bids-list">
              {bids.map((bid, index) => (
                <div
                  key={`bid-${bid._id || index}-${bid.timestamp}`}
                  className={`bid-item ${index === 0 ? 'highest-bid' : ''}`}
                >
                  <div className="bid-rank">
                    {index === 0 ? '👑' : `#${index + 1}`}
                  </div>
                  <div className="bid-details">
                    <div className="bidder-info">
                      <span className="bidder-name">{bid.bidderName}</span>
                      <span className="bidder-mobile">{maskMobileNumber(bid.mobileNumber)}</span>
                    </div>
                    <div className="bid-meta">
                      <span className="bid-date">{formatDate(bid.timestamp)}</span>
                    </div>
                  </div>
                  <div className="bid-amount">
                    {formatCurrency(bid.bidAmount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bids">
              <p>
                {status === 'Active' 
                  ? 'No bids placed yet. Be the first to bid!' 
                  : 'No bids were placed for this land.'
                }
              </p>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBidsModal;
