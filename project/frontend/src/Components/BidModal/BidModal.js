import React, { useState } from 'react';
import axios from 'axios';
import './BidModal.css';

const BidModal = ({ land, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bidderName: '',
    mobileNumber: '', 
    NIC:'',
    bidAmount: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bidderName.trim()) {
      newErrors.bidderName = 'Bidder name is required';
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobile number (10-15 digits)';
    }

   
  if (!formData.NIC.trim()) {
      newErrors.NIC = 'NIC number is required';
  } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(formData.NIC.trim())) { // <--- Recommended NIC validation regex for Sri Lanka
      newErrors.NIC = 'Please enter a valid NIC number';
  }
    
    
    if (!formData.bidAmount) {
      newErrors.bidAmount = 'Bid amount is required';
    } else if (isNaN(formData.bidAmount) || parseFloat(formData.bidAmount) <= 0) {
      newErrors.bidAmount = 'Bid amount must be a positive number';
    } else if (parseFloat(formData.bidAmount) <= land.amount) {
      newErrors.bidAmount = `Bid amount must be higher than ${formatCurrency(land.amount)}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Corrected handleSubmit function
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/bids/${land._id}`, {
        bidderName: formData.bidderName.trim(),
        mobileNumber: formData.mobileNumber.replace(/\s/g, ''),
        NIC: formData.NIC.trim(), // <--- Add this line
        bidAmount: parseFloat(formData.bidAmount)
      });
      
      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to place bid. Please try again.'
      });
    } finally {
      setLoading(false);
    }
};
  const getHighestBid = () => {
    if (!land.bids || land.bids.length === 0) return land.amount;
    return Math.max(...land.bids.map(bid => bid.bidAmount));
  };

  const highestBid = getHighestBid();
  const minimumBid = highestBid + 1;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content bid-modal">
        <div className="modal-header">
          <h2 className="modal-title">Place Your Bid</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Land Info */}
        <div className="land-info-card">
          <div className="land-info-image">
            <img src={land.imageUrl} alt="Land" />
          </div>
          <div className="land-info-details">
            <h3>{land.ownerName}'s Land</h3>
            <p className="land-location">📍 {land.location?.address || 'Unknown Location'}</p>
            <div className="land-bid-info">
              <div className="bid-info-item">
                <span className="label">Base Amount:</span>
                <span className="value">{formatCurrency(land.amount)}</span>
              </div>
              <div className="bid-info-item">
                <span className="label">Current Highest:</span>
                <span className="value">{formatCurrency(highestBid)}</span>
              </div>
              <div className="bid-info-item">
                <span className="label">Minimum Bid:</span>
                <span className="value minimum">{formatCurrency(minimumBid)}</span>
              </div>
            </div>
            {land.daysRemaining !== undefined && (
              <div className="time-remaining">
                <span className="status-badge status-active">
                  {land.daysRemaining} DAYS REMAINING
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bid-form">
          <div className="form-group">
            <label className="form-label required">Your Name</label>
            <input
              type="text"
              name="bidderName"
              value={formData.bidderName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.bidderName && <div className="form-error">{errors.bidderName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label required">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your mobile number"
              disabled={loading}
            />
            {errors.mobileNumber && <div className="form-error">{errors.mobileNumber}</div>}
          </div>



 <div className="form-group">
            <label className="form-label required">NIC Number</label>
            <input
              type="tel"
              name="NIC"
              value={formData.NIC}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your NIC number"
              disabled={loading}
            />
            {errors.NIC && <div className="form-error">{errors.NIC}</div>}
          </div>

         

          <div className="form-group">
            <label className="form-label required">
              Bid Amount (Minimum: {formatCurrency(minimumBid)})
            </label>
            <div className="bid-amount-container">
              <span className="currency-symbol">Rs.  </span>
              <input
                type="number"
                name="bidAmount"
                value={formData.bidAmount}
                onChange={handleInputChange}
                className="form-input bid-amount-input"
                placeholder={minimumBid.toString()}
                min={minimumBid}
                step="1"
                disabled={loading}
              />
            </div>
            {errors.bidAmount && <div className="form-error">{errors.bidAmount}</div>}
          </div>

          {errors.submit && (
            <div className="form-error submit-error">{errors.submit}</div>
          )}

          <div className="bid-summary">
            <div className="summary-row">
              <span>Your Bid:</span>
              <span className="bid-amount-display">
                {formData.bidAmount ? formatCurrency(parseFloat(formData.bidAmount) || 0) : 'Rs.0'}
              </span>
            </div>
            {formData.bidAmount && parseFloat(formData.bidAmount) > highestBid && (
              <div className="summary-row highlight">
                <span>Increase from current highest:</span>
                <span className="increase-amount">
                  +{formatCurrency(parseFloat(formData.bidAmount) - highestBid)}
                </span>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.bidderName || !formData.mobileNumber || !formData.NIC || !formData.bidAmount}
            >
              {loading ? 'Placing Bid...' : (
                <>
                  🏆 Place Bid
                </>
              )}
            </button>
          </div>
        </form>

        <div className="bid-disclaimer">
          <p>
            <strong>Note:</strong> Once placed, bids cannot be cancelled or modified. 
            Make sure your bid amount is correct before submitting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BidModal;