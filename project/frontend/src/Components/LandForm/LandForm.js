import React, { useState, useRef } from 'react';
import axios from 'axios';
import './LandForm.css';

const LandForm = ({ onClose, onSuccess, editLand = null }) => {
  const isEditing = !!editLand;
  
  const [formData, setFormData] = useState({
    ownerName: editLand?.ownerName || '',
    address: editLand?.location?.address || '',
    lat: editLand?.location?.coordinates?.lat || '',
    lng: editLand?.location?.coordinates?.lng || '',
    area: editLand?.area || '',
    soilType: editLand?.soilType || '',
    resources: editLand?.resources || [],
    amount: editLand?.amount || '',
    description: editLand?.description || '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(editLand?.imageUrl || null);
  const [newResource, setNewResource] = useState('');
  const fileInputRef = useRef(null);

  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky'];
  const commonResources = ['Irrigation', 'Electricity', 'Water Well', 'Road Access', 'Storage Facility', 'Machinery', 'Greenhouse'];

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const addResource = () => {
    if (newResource.trim() && !formData.resources.includes(newResource.trim())) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const removeResource = (resource) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r !== resource)
    }));
  };

  const addCommonResource = (resource) => {
    if (!formData.resources.includes(resource)) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, resource]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.lat) newErrors.lat = 'Latitude is required';
    if (!formData.lng) newErrors.lng = 'Longitude is required';
    if (!formData.area || formData.area <= 0) newErrors.area = 'Valid area is required';
    if (!formData.soilType) newErrors.soilType = 'Soil type is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Image is only required for new lands, not when editing
    if (!isEditing && !formData.image) newErrors.image = 'Land image is required';
    
    // Validate coordinates
    if (formData.lat && (formData.lat < -90 || formData.lat > 90)) {
      newErrors.lat = 'Latitude must be between -90 and 90';
    }
    if (formData.lng && (formData.lng < -180 || formData.lng > 180)) {
      newErrors.lng = 'Longitude must be between -180 and 180';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Only append image if a new one was selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      submitData.append('ownerName', formData.ownerName);
      submitData.append('address', formData.address);
      submitData.append('lat', formData.lat);
      submitData.append('lng', formData.lng);
      submitData.append('area', formData.area);
      submitData.append('soilType', formData.soilType);
      submitData.append('resources', JSON.stringify(formData.resources));
      submitData.append('amount', formData.amount);
      submitData.append('description', formData.description);
      
      const response = isEditing 
        ? await axios.put(`http://localhost:5000/api/lands/${editLand._id}`, submitData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axios.post('http://localhost:5000/api/lands', submitData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
      
      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} land:`, error);
      setErrors({
        submit: error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} land. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  // Simple location picker (in a real app, you'd integrate Google Maps)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content land-form-modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Land' : 'Add New Land'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="land-form">
          {/* Image Upload */}
          <div className="form-group">
            <label className={`form-label${isEditing ? '' : ' required'}`}>Land Image</label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Land preview" />
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                  <span className="upload-icon">📷</span>
                  <span>Click to upload land image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            {errors.image && <div className="form-error">{errors.image}</div>}
          </div>

          {/* Owner Name */}
          <div className="form-group">
            <label className="form-label required">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter land owner's name"
            />
            {errors.ownerName && <div className="form-error">{errors.ownerName}</div>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label required">Location</label>
            <div className="location-container">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter address"
              />
              <button
                type="button"
                className="btn btn-secondary get-location-btn"
                onClick={getCurrentLocation}
              >
                📍 Get Current Location
              </button>
            </div>
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          {/* Coordinates */}
          <div className="coordinates-group">
            <div className="form-group">
              <label className="form-label required">Latitude</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 40.7128"
                step="any"
              />
              {errors.lat && <div className="form-error">{errors.lat}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Longitude</label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., -74.0060"
                step="any"
              />
              {errors.lng && <div className="form-error">{errors.lng}</div>}
            </div>
          </div>

          {/* Area and Soil Type */}
          <div className="row-group">
            <div className="form-group">
              <label className="form-label required">Area (acres)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 5.5"
                step="0.1"
                min="0.1"
              />
              {errors.area && <div className="form-error">{errors.area}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Soil Type</label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select soil type</option>
                {soilTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.soilType && <div className="form-error">{errors.soilType}</div>}
            </div>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label required">Base Amount (Rs.)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., 50000"
              min="1"
            />
            {errors.amount && <div className="form-error">{errors.amount}</div>}
          </div>

          {/* Resources */}
          <div className="form-group">
            <label className="form-label">Resources Available</label>
            
            {/* Common Resources */}
            <div className="common-resources">
              <p className="resources-subtitle">Common Resources:</p>
              <div className="common-resources-grid">
                {commonResources.map(resource => (
                  <button
                    key={resource}
                    type="button"
                    className={`resource-btn ${formData.resources.includes(resource) ? 'selected' : ''}`}
                    onClick={() => addCommonResource(resource)}
                    disabled={formData.resources.includes(resource)}
                  >
                    {resource}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Resource Input */}
            <div className="custom-resource-input">
              <input
                type="text"
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                className="form-input"
                placeholder="Add custom resource"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addResource}
              >
                Add
              </button>
            </div>

            {/* Selected Resources */}
            {formData.resources.length > 0 && (
              <div className="selected-resources">
                <p className="resources-subtitle">Selected Resources:</p>
                <div className="resources-container">
                  {formData.resources.map(resource => (
                    <div key={resource} className="resource-tag">
                      {resource}
                      <button
                        type="button"
                        onClick={() => removeResource(resource)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label required">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe the land, its features, and any additional information..."
              rows="4"
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>

          {errors.submit && <div className="form-error submit-error">{errors.submit}</div>}

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
              disabled={loading}
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Land' : 'Create Land')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandForm;