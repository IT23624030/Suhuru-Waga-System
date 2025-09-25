// SriLankaMap.js
import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SriLankaMap.css';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Recenter the map when position changes
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 13);
    }
  }, [position, map]);

  return null;
}

function MapClickHandler({ setPosition }) {
  const map = useMap();

  useEffect(() => {
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
    });

    return () => {
      map.off();
    };
  }, [map, setPosition]);

  return null;
}

const SriLankaMap = ({ position, setPosition }) => {
  const provider = new OpenStreetMapProvider();

  const handleSearch = async (e) => {
    const query = e.target.value;

    if (query.length < 3) return;

    const results = await provider.search({ query });

    if (results && results.length > 0) {
      const first = results[0];
      setPosition({ lat: first.y, lng: first.x });
    }
  };

  return (
    <div className="map-section">
      <input
        type="text"
        className="search-box"
        placeholder="Search delivery location..."
        onChange={handleSearch}
      />

      <div className="map-container">
        <MapContainer
          center={position || [7.8731, 80.7718]} // Default: Sri Lanka
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {position && (
            <Marker position={[position.lat, position.lng]}>
              <Popup>Selected Delivery Location</Popup>
            </Marker>
          )}

          <RecenterMap position={position} />
          <MapClickHandler setPosition={setPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default SriLankaMap;