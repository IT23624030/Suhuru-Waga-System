import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherWidget from '../Components/WeatherWidget/WeatherWidget';
import axios from 'axios';
import './land.css'; 
import LandForm from '../Components/LandForm/LandForm';
import LandCard from '../Components/LandCard/LandCard';
import SearchBar from '../Components/SearchBar/SearchBar';
import BidModal from '../Components/BidModal/BidModal';
import ViewBidsModal from '../Components/ViewBidsModal/ViewBidsModal';
import ConfirmModal from '../Components/ConfirmModal/ConfirmModal';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';
import Navi from '../Components/Features/Navi/Nav3';
import Footer from "../Components/Home/Footer/Footer";

const Land = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Modal states
  const [showLandForm, setShowLandForm] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showViewBidsModal, setShowViewBidsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Selected items
  const [editingLand, setEditingLand] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [landToDelete, setLandToDelete] = useState(null);

  // Check user authentication on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch lands
  const fetchLands = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/lands', {
        params: {
          page,
          limit: 12,
          search
        }
      });

      if (response.data.success) {
        setLands(response.data.data);
        setTotalPages(response.data.pagination.total);
        setCurrentPage(response.data.pagination.current);
      }
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLands(1, searchTerm);
  }, [refreshTrigger]);

  // Handle search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchLands(1, searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchLands(page, searchTerm);
  };

  // Handle land creation/edit success
  const handleLandSuccess = () => {
    setShowLandForm(false);
    setEditingLand(null);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle edit click
  const handleEditClick = (land) => {
    setEditingLand(land);
    setShowLandForm(true);
  };

  // Handle delete click
  const handleDeleteClick = (land) => {
    setLandToDelete(land);
    setShowDeleteConfirm(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!landToDelete) return;
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/lands/${landToDelete._id}`);
      if (response.data.success) {
        setRefreshTrigger(prev => prev + 1);
        alert('Land deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting land:', error);
      alert('Failed to delete land. Please try again.');
    }
  };

  // Handle bid modal
  const handleBidClick = (land) => {
    setSelectedLand(land);
    setShowBidModal(true);
  };

  // Handle view bids modal
  const handleViewBidsClick = (land) => {
    setSelectedLand(land);
    setShowViewBidsModal(true);
  };

  // Handle bid success
  const handleBidSuccess = () => {
    setShowBidModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      
      {/* Nav3 fixed at top-left */}
      <div className="nav3-top-left">
        <Navi />
      </div>
      
      {/* Navigation Bar */}
      <nav className="land-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-logo">🌾</span>
            <span className="brand-name">SuhuruWaga</span>
          </div>
          
          <div className="navbar-menu">
            <button 
              className="nav-item"
              onClick={() => navigate('/home2')}
            >
              🏠 Home
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/Features')}
            >
              ⭐ Features
            </button>
            {/* <button 
              className="nav-item"
              onClick={() => navigate('/Calculator')}
            >
              🧮 Calculator
            </button>*/}
            <button 
              className="nav-item"
              onClick={() => navigate('/crop-suggest')}
            >
              🌱 Crop Advisor
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/about')}
            >
              ℹ️ About
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/contact')}
            >
              📞 Contact
            </button>
            <button 
              className="nav-item"
              onClick={() => navigate('/View')}
            >
               🪃 View
            </button>

             <button 
              className="nav-item"
              onClick={() => navigate('/land')}
            >
               🍁 Land
            </button>

              <button 
              className="nav-item"
              onClick={() => navigate('/SriLankaMap')}
            >
               🌎 Map
            </button>
          </div>

          
        </div>
      </nav>

      <div className="home">
        {/* Header */}
        <header className="home-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="home-title">🌾SUHURU Bidding Platform</h1>
              <p className="home-subtitle">Connect farmers with premium agricultural land</p>
            </div>
            <div className="header-right">
              {user && (
                <div className="user-info">
                  <span className="welcome-text">Welcome, {user.fullname}</span>
                  <button 
                    className="btn btn-outline profile-btn"
                    onClick={() => navigate('/Profile')}
                  >
                    👤 My Profile
                  </button>
                  <button 
                    className="btn btn-outline logout-btn"
                    onClick={() => {
                      localStorage.removeItem('user');
                      navigate('/');
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
              {!user && (
                <div className="auth-buttons">
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate('/Login')}
                  >
                    Login
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/Createp')}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="home-main-content">
          {/* Controls Section */}
          <section className="controls-section">
            <div className="controls-container">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by owner, location, soil type..."
              />

              <button 
              className="btn btn-primary add-land-btn"
              onClick={() => navigate('/landforms')}
            >
               Documents
            </button>

              <button
                className="btn btn-primary add-land-btn"
                onClick={() => {
                  setEditingLand(null);
                  setShowLandForm(true);
                }}
              >
                + Add New Land
              </button>
            </div>
          </section>
        <WeatherWidget />

          {/* Content Section */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Results Info */}
              <div className="results-info">
                <p>{lands.length} land{lands.length !== 1 ? 's' : ''} found</p>
              </div>

              {/* Lands Grid */}
              <section className="lands-grid">
                {lands.length > 0 ? (
                  lands.map((land, index) => (
                    <LandCard
                      key={`land-${land._id}-${land.updatedAt || land.createdAt}`}
                      land={land}
                      index={index}
                      onBidClick={() => handleBidClick(land)}
                      onViewBidsClick={() => handleViewBidsClick(land)}
                      onEditClick={() => handleEditClick(land)}
                      onDeleteClick={() => handleDeleteClick(land)}
                    />
                  ))
                ) : (
                  <div className="no-results">
                    <p>No lands found. {searchTerm ? 'Try a different search term.' : 'Be the first to add a land!'}</p>
                  </div>
                )}
              </section>

              {/* Pagination */}
              {totalPages > 1 && (
                <section className="pagination-section">
                  <div className="pagination">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    <span className="page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      className="btn btn-secondary"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </section>
              )}
            </>
          )}
        </main>

        {/* Modals */}
        {showLandForm && (
          <LandForm
            onClose={() => {
              setShowLandForm(false);
              setEditingLand(null);
            }}
            onSuccess={handleLandSuccess}
            editLand={editingLand}
          />
        )}
        
        {showBidModal && selectedLand && (
          <BidModal
            land={selectedLand}
            onClose={() => setShowBidModal(false)}
            onSuccess={handleBidSuccess}
          />
        )}
        
        {showViewBidsModal && selectedLand && (
          <ViewBidsModal
            land={selectedLand}
            onClose={() => setShowViewBidsModal(false)}
          />
        )}

        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setLandToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Land"
          message={`Are you sure you want to delete ${landToDelete?.ownerName}'s land? This action cannot be undone and will also delete all associated bids.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
       <Footer /> 
    </div>
  );
};

export default Land;