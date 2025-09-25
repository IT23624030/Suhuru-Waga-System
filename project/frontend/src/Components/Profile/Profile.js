import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from "../Home/Nav/Nav";
import Footer from "../Home/Footer/Footer";
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/Login');
          return;
        }

        const user = JSON.parse(userData);
        const response = await axios.get(`http://localhost:5000/users/${user._id}`);
        
        if (response.data.status === 'ok') {
          setUserDetails(response.data.user);
        } else {
          setError('Failed to load user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="profile-container">
          <div className="loading">Loading your profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Nav />
        <div className="profile-container">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Land Owner Profile</h1>
          <p>Manage your account information</p>
        </div>

        {userDetails && (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {userDetails.fullname ? userDetails.fullname.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>

              <div className="profile-info">
                <h2>{userDetails.fullname}</h2>
                <p className="profile-email">{userDetails.email}</p>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <span>{userDetails.fullname}</span>
                  </div>
                  <div className="detail-item">
                    <label>Age</label>
                    <span>{userDetails.age} years</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <label>Gender</label>
                    <span>{userDetails.gender}</span>
                  </div>
                  <div className="detail-item">
                    <label>NIC Number</label>
                    <span>{userDetails.NIC}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <label>Contact Number</label>
                    <span>{userDetails.contact_number}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{userDetails.email}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <label>District</label>
                    <span>{userDetails.distric}</span>
                  </div>
                  <div className="detail-item">
                    <label>City</label>
                    <span>{userDetails.city}</span>
                  </div>
                </div>

                <div className="detail-row full-width">
                  <div className="detail-item">
                    <label>Address</label>
                    <span>{userDetails.address}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <label>Experience</label>
                    <span>{userDetails.experience} years</span>
                  </div>
                  <div className="detail-item">
                    <label>Agricultural Activities</label>
                    <span>{userDetails.agri_activities || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-primary" onClick={() => navigate('/land')}>
                  Manage My Lands
                </button>
                <button className="btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;