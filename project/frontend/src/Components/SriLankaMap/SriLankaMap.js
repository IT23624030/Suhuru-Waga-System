import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SriLankaMap.css';
import kandyPhoto from '../../assets/lp1.jpeg';
import DambullaPhoto from '../../assets/lp2.jpg';
import colomboPhoto from '../../assets/lp3.jpeg';
import AnuraPhoto from '../../assets/lp4.jpg';
import polaPhoto from '../../assets/lp5.jpg';
import mirissaPhoto from '../../assets/lp6.jpeg';






// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// Custom icons
const createCustomIcon = (color = '#3388ff') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Sri Lanka major cities and landmarks with landowner information
const SRI_LANKA_LOCATIONS = {
  'Colombo': { 
    lat: 6.9271, 
    lng: 79.8612, 
    type: 'capital',
    landowner: 'Mr. Ranjith Silva',
    place: 'Colombo City Center',
    landPhoto: colomboPhoto // Default photo, you can replace with actual land photos
  },
'Kandy': {  
  lat: 7.2906, 
  lng: 80.6337, 
  type: 'cultural',
  landowner: 'Mrs. Kamala Perera',
  place: 'Kandy Cultural District',
  landPhoto: kandyPhoto
},
  'Galle': { 
    lat: 6.0535, 
    lng: 80.2210, 
    type: 'coastal',
    landowner: 'Mr. Sunil Fernando',
    place: 'Galle Fort Area',
    landPhoto: kandyPhoto
  },
  'Jaffna': { 
    lat: 9.6615, 
    lng: 80.0255, 
    type: 'northern',
    landowner: 'Mr. Tharmalingam',
    place: 'Jaffna Peninsula',
    landPhoto: DambullaPhoto
  },
  'Trincomalee': { 
    lat: 8.5881, 
    lng: 81.2155, 
    type: 'eastern',
    landowner: 'Mrs. Lakshmi Devi',
    place: 'Trincomalee Harbor',
    landPhoto: kandyPhoto
  },
  'Anuradhapura': { 
    lat: 8.3114, 
    lng: 80.4037, 
    type: 'ancient',
    landowner: 'Mr. Bandara',
    place: 'Anuradhapura Sacred City',
  landPhoto: AnuraPhoto
  },
  'Polonnaruwa': { 
    lat: 7.8731, 
    lng: 81.0029, 
    type: 'ancient',
    landowner: 'Mr. Wijesekara',
    place: 'Polonnaruwa Ancient City',
    landPhoto: polaPhoto
  },
  'Sigiriya': { 
    lat: 7.9570, 
    lng: 80.7603, 
    type: 'heritage',
    landowner: 'Mr. Rajapakse',
    place: 'Sigiriya Rock Fortress',
    landPhoto: AnuraPhoto
  },
  'Nuwara Eliya': { 
    lat: 6.9497, 
    lng: 79.8607, 
    type: 'hill',
    landowner: 'Mrs. Nirmala',
    place: 'Nuwara Eliya Hill Station',
    landPhoto: polaPhoto
  },
  'Bentota': { 
    lat: 6.4184, 
    lng: 79.9887, 
    type: 'coastal',
    landowner: 'Mr. Karunaratne',
    place: 'Bentota Beach Resort',
    landPhoto: mirissaPhoto
  },
  'Mirissa': { 
    lat: 5.9431, 
    lng: 80.4568, 
    type: 'coastal',
    landowner: 'Mr. Mendis',
    place: 'Mirissa Fishing Village',
    landPhoto: mirissaPhoto
  },
  'Ella': { 
    lat: 6.8667, 
    lng: 81.0500, 
    type: 'hill',
    landowner: 'Mrs. Pushpa',
    place: 'Ella Gap View',
    landPhoto: mirissaPhoto
  },
  'Dambulla': { 
    lat: 7.8567, 
    lng: 80.6492, 
    type: 'cultural',
    landowner: 'Mr. Senanayake',
    place: 'Dambulla Cave Temple',
    landPhoto: DambullaPhoto
  },
  'Ratnapura': { 
    lat: 6.6828, 
    lng: 80.3990, 
    type: 'gem',
    landowner: 'Mr. Gunawardena',
    place: 'Ratnapura Gem Fields',
    landPhoto: polaPhoto
  },
  'Hambantota': { 
    lat: 6.1239, 
    lng: 81.1185, 
    type: 'southern',
    landowner: 'Mr. Mahinda',
    place: 'Hambantota Port City',
    landPhoto: polaPhoto
  }
};

// Sri Lanka boundaries (approximate)
const SRI_LANKA_BOUNDS = [
  [5.916667, 79.516667], // Southwest
  [9.850000, 81.883333]  // Northeast
];

// Map center (Colombo)
const MAP_CENTER = [6.9271, 79.8612];

// Component to handle map view updates
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

const SriLankaMap = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [mapCenter, setMapCenter] = useState(MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(8);
  const [showAllLocations, setShowAllLocations] = useState(true);
  const [filterType, setFilterType] = useState('all');

  
  //  Add this line
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  
  const mapRef = useRef();
  const trackingIntervalRef = useRef();

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude, name: 'Your Location' };
          setUserLocation(newLocation);
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Start live tracking
  const startTracking = () => {
    if (!userLocation) {
      getUserLocation();
      return;
    }
    
    setIsTracking(true);
    setTrackingHistory([userLocation]);
    
    trackingIntervalRef.current = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { 
              lat: latitude, 
              lng: longitude, 
              name: 'Your Location',
              timestamp: new Date().toLocaleTimeString()
            };
            setUserLocation(newLocation);
            setTrackingHistory(prev => [...prev, newLocation]);
          },
          (error) => {
            console.error('Tracking error:', error);
          }
        );
      }
    }, 5000); // Update every 5 seconds
  };

  // Stop live tracking
  const stopTracking = () => {
    setIsTracking(false);
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
    }
  };

  // Search for locations
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase();
    const foundLocation = Object.entries(SRI_LANKA_LOCATIONS).find(([name, data]) =>
      name.toLowerCase().includes(query) || 
      data.type.toLowerCase().includes(query)
    );
    
    if (foundLocation) {
      const [name, data] = foundLocation;
      setSelectedLocation({ ...data, name });
      setMapCenter([data.lat, data.lng]);
      setMapZoom(12);
    } else {
      alert('Location not found. Try searching for major cities or landmarks.');
    }
  };

  // Calculate route between two points
  const calculateRoute = (from, to) => {
    if (!from || !to) return;
    
    // Simple straight line route (in a real app, you'd use a routing service)
    const routeData = [
      [from.lat, from.lng],
      [to.lat, to.lng]
    ];
    setRoute(routeData);
  };

  // Filter locations by type
  const filteredLocations = Object.entries(SRI_LANKA_LOCATIONS).filter(([name, data]) => {
    if (filterType === 'all') return true;
    return data.type === filterType;
  });

  // Clear route
  const clearRoute = () => {
    setRoute(null);
    setSelectedLocation(null);
  };

  // Handle location selection
  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    if (userLocation) {
      calculateRoute(userLocation, location);
    }
  };

  // Handle map click
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const clickedLocation = { lat, lng, name: 'Custom Location' };
    setSelectedLocation(clickedLocation);
    if (userLocation) {
      calculateRoute(userLocation, clickedLocation);
    }
  };

  // Navigate to land page
  const navigateToLandPage = () => {
    navigate('/land');
  };

  useEffect(() => {
    // Cleanup tracking interval on unmount
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  return (
     <div className="">

      {/* ✅ Navigation Bar added here */}
      <nav className="land-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-logo">🌾</span>
            <span className="brand-name">SuhuruWaga</span>
          </div>

          <div className="navbar-menu">
            <button className="nav-item" onClick={() => navigate('/home2')}>🏠 Home</button>
            <button className="nav-item" onClick={() => navigate('/Features')}>⭐ Features</button>
            <button className="nav-item" onClick={() => navigate('/Calculator')}>🧮 Calculator</button>
            <button className="nav-item" onClick={() => navigate('/CropAdvisor')}>🌱 Crop Advisor</button>
            <button className="nav-item" onClick={() => navigate('/about')}>ℹ️ About</button>
            <button className="nav-item" onClick={() => navigate('/contact')}>📞 Contact</button>
            <button className="nav-item" onClick={() => navigate('/View')}>🪃 View</button>
            <button className="nav-item" onClick={() => navigate('/land')}>🍁 Land</button>
            <button className="nav-item" onClick={() => navigate('/SriLankaMap')}>🌎 Map</button>
            
          </div>

          
        </div>
      </nav>
      {/* ✅ End of Nav */}
    
    <div className="">
      <div className="map-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search for locations in Sri Lanka..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>
        
        <div className="control-buttons">
          <button 
            onClick={getUserLocation} 
            className="control-btn location-btn"
            title="Get your current location"
          >
            📍 Get Location
          </button>
          
          <button 
            onClick={isTracking ? stopTracking : startTracking} 
            className={`control-btn tracking-btn ${isTracking ? 'active' : ''}`}
            title={isTracking ? 'Stop tracking' : 'Start live tracking'}
          >
            {isTracking ? '⏹️ Stop Tracking' : '▶️ Start Tracking'}
          </button>
          
          <button 
            onClick={clearRoute} 
            className="control-btn clear-btn"
            title="Clear route and selection"
          >
            🗑️ Clear
          </button>
        </div>
        
        <div className="filter-controls">
          <label>Filter by type:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Locations</option>
            <option value="capital">Capital</option>
            <option value="cultural">Cultural</option>
            <option value="coastal">Coastal</option>
            <option value="ancient">Ancient</option>
            <option value="heritage">Heritage</option>
            <option value="hill">Hill Country</option>
            <option value="northern">Northern</option>
            <option value="eastern">Eastern</option>
            <option value="southern">Southern</option>
            <option value="gem">Gem Cities</option>
          </select>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showAllLocations}
              onChange={(e) => setShowAllLocations(e.target.checked)}
            />
            Show all locations
          </label>
        </div>
      </div>

      <div className="map-info-panel">
        <div className="info-section">
          <h3>Location Info</h3>
          {selectedLocation ? (
            <div>
              <p><strong>Name:</strong> {selectedLocation.name}</p>
              <p><strong>Coordinates:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
              {selectedLocation.type && <p><strong>Type:</strong> {selectedLocation.type}</p>}
              
              {/* Show landowner information if available */}
              {selectedLocation.landowner && (
                <div className="selected-location-landowner">
                  <div className="land-photo-small">
                    <img src={selectedLocation.landPhoto} alt={`Land in ${selectedLocation.name}`} />
                  </div>
                  <div className="land-details-small">
                    <p><strong>Owner:</strong> {selectedLocation.landowner}</p>
                    <p><strong>Place:</strong> {selectedLocation.place}</p>
                  </div>
                </div>
              )}
              
              <div className="location-actions">
                {userLocation && (
                  <button 
                    onClick={() => calculateRoute(userLocation, selectedLocation)}
                    className="route-btn"
                  >
                    🚗 Get Route from Your Location
                  </button>
                )}
                
                {selectedLocation.landowner && (
                  <button 
                    onClick={navigateToLandPage}
                    className="land-details-btn"
                  >
                    🏠 View Land Details
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>Click on a location or search to see details</p>
          )}
        </div>

        {userLocation && (
          <div className="info-section">
            <h3>Your Location</h3>
            <p><strong>Coordinates:</strong> {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
            <p><strong>Status:</strong> {isTracking ? '🟢 Live Tracking' : '⚪ Not Tracking'}</p>
            {trackingHistory.length > 1 && (
              <p><strong>Tracked Points:</strong> {trackingHistory.length}</p>
            )}
          </div>
        )}

        {route && (
          <div className="info-section">
            <h3>Route Information</h3>
            <p><strong>From:</strong> {userLocation?.name || 'Unknown'}</p>
            <p><strong>To:</strong> {selectedLocation?.name || 'Unknown'}</p>
            <p><strong>Distance:</strong> Calculating...</p>
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '600px', width: '100%' }}
          ref={mapRef}
          onClick={handleMapClick}
          maxBounds={SRI_LANKA_BOUNDS}
          maxBoundsViscosity={1.0}
        >
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          {/* OpenStreetMap tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Show all Sri Lanka locations */}
          {showAllLocations && filteredLocations.map(([name, data]) => (
            <Marker
              key={name}
              position={[data.lat, data.lng]}
              icon={createCustomIcon(
                data.type === 'capital' ? '#ff4444' :
                data.type === 'cultural' ? '#44aa44' :
                data.type === 'coastal' ? '#4444ff' :
                data.type === 'ancient' ? '#aa4444' :
                data.type === 'heritage' ? '#aa8844' :
                data.type === 'hill' ? '#44aa88' :
                '#888888'
              )}
              eventHandlers={{
                click: () => handleLocationClick({ ...data, name })
              }}
            >
                             <Popup>
                 <div className="land-popup">
                   <h4>{name}</h4>
                   <p><strong>Type:</strong> {data.type}</p>
                   <p><strong>Coordinates:</strong> {data.lat.toFixed(4)}, {data.lng.toFixed(4)}</p>
                   
                   {/* Landowner Information */}
                   <div className="landowner-info">
                     <div className="land-photo">
                       <img src={data.landPhoto} alt={`Land in ${name}`} />
                     </div>
                     <div className="land-details">
                       <p><strong>Owner:</strong> {data.landowner}</p>
                       <p><strong>Place:</strong> {data.place}</p>
                     </div>
                   </div>
                   
                   <div className="popup-buttons">
                     <button 
                       onClick={() => handleLocationClick({ ...data, name })}
                       className="popup-btn select-btn"
                     >
                       Select Location
                     </button>
                     <button 
                       onClick={navigateToLandPage}
                       className="popup-btn land-btn"
                     >
                       View Land Details
                     </button>
                   </div>
                 </div>
               </Popup>
            </Marker>
          ))}

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#ff8800')}
            >
              <Popup>
                <div>
                  <h4>Your Location</h4>
                  <p><strong>Coordinates:</strong> {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                  <p><strong>Status:</strong> {isTracking ? 'Live Tracking' : 'Static'}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Selected location marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createCustomIcon('#ff0088')}
            >
              <Popup>
                <div>
                  <h4>{selectedLocation.name}</h4>
                  <p><strong>Coordinates:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
                  {selectedLocation.type && <p><strong>Type:</strong> {selectedLocation.type}</p>}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route line */}
          {route && (
            <Polyline
              positions={route}
              color="#ff0088"
              weight={4}
              opacity={0.8}
            />
          )}

          {/* Tracking history path */}
          {trackingHistory.length > 1 && (
            <Polyline
              positions={trackingHistory.map(loc => [loc.lat, loc.lng])}
              color="#00ff88"
              weight={2}
              opacity={0.6}
              dashArray="5, 10"
            />
          )}
        </MapContainer>
      </div>

      <div className="map-footer">
        <p>
          <strong>Sri Lanka Interactive Map</strong> - 
          Live tracking, destination search, and route planning
        </p>
        <p>
          Click on the map to set custom locations or use the search to find major cities and landmarks
        </p>
      </div>
    </div>
  

    </div>
  );
};

export default SriLankaMap;