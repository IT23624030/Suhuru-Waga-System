import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [animateToggle, setAnimateToggle] = useState(false);

  // Famous districts in Sri Lanka for agriculture
  const sriLankanDistricts = [
    { name: 'Colombo', coordinates: { lat: 6.9271, lon: 79.8612 } },
    { name: 'Kandy', coordinates: { lat: 7.2906, lon: 80.6337 } },
    { name: 'Galle', coordinates: { lat: 6.0535, lon: 80.2210 } },
    { name: 'Anuradhapura', coordinates: { lat: 8.3114, lon: 80.4037 } },
    { name: 'Kurunegala', coordinates: { lat: 7.4818, lon: 80.3609 } },
    { name: 'Hambantota', coordinates: { lat: 6.1241, lon: 81.1185 } },
    { name: 'Ratnapura', coordinates: { lat: 6.6828, lon: 80.4036 } },
    { name: 'Badulla', coordinates: { lat: 6.9934, lon: 81.0550 } },
    { name: 'Mathale', coordinates: { lat: 6.1241, lon: 81.1185 } },
    { name: 'Nuwara Eliya', coordinates: { lat: 7.4818, lon: 80.3609 } },
    { name: 'Ampara', coordinates: { lat: 7.4818, lon: 80.3609 } },
    { name: 'Monaragala', coordinates: { lat: 6.0535, lon: 80.2210 } },
    { name: 'Gampaha', coordinates: { lat: 7.2906, lon: 80.6337 } },
    { name: 'Polonnaruwa', coordinates: { lat: 8.3114, lon: 80.4037 } }




  ];

  // Demo weather data for when API key is not available
  const getDemoWeatherData = (district) => {
    const demoWeatherConditions = [
      { temp: 28, description: 'partly cloudy', icon: '02d', humidity: 75, wind: 3.2, pressure: 1013 },
      { temp: 32, description: 'sunny', icon: '01d', humidity: 60, wind: 2.1, pressure: 1015 },
      { temp: 26, description: 'light rain', icon: '10d', humidity: 85, wind: 4.5, pressure: 1010 },
      { temp: 30, description: 'clear sky', icon: '01d', humidity: 65, wind: 2.8, pressure: 1014 },
    ];
    
    const randomWeather = demoWeatherConditions[Math.floor(Math.random() * demoWeatherConditions.length)];
    
    return {
      districtName: district.name,
      main: {
        temp: randomWeather.temp,
        feels_like: randomWeather.temp + 2,
        humidity: randomWeather.humidity,
        pressure: randomWeather.pressure
      },
      weather: [{
        description: randomWeather.description,
        icon: randomWeather.icon
      }],
      wind: {
        speed: randomWeather.wind
      },
      sys: {
        sunrise: Math.floor(Date.now() / 1000) - 8 * 3600, // 8 hours ago
        sunset: Math.floor(Date.now() / 1000) + 2 * 3600   // 2 hours from now
      }
    };
  };

  const fetchAllWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;
      let weatherResults = [];

      if (apiKey) {
        // Try live mode for listed cities using OpenWeather
        const responses = await Promise.all(
          sriLankanDistricts.map(async (district) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${district.coordinates.lat}&lon=${district.coordinates.lon}&appid=${apiKey}&units=metric`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch weather');
            const data = await res.json();
            return { ...data, districtName: district.name };
          })
        );
        weatherResults = responses;
      } else {
        // Fallback to demo data
        weatherResults = sriLankanDistricts.map(district => getDemoWeatherData(district));
      }

      setWeatherData(weatherResults);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Show Kandy as the current place by default (user request)
    const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;
    const kandy = sriLankanDistricts.find(d => d.name === 'Kandy');

    const loadKandy = async () => {
      try {
        if (apiKey && kandy) {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${kandy.coordinates.lat}&lon=${kandy.coordinates.lon}&appid=${apiKey}&units=metric`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to fetch Kandy weather');
          const data = await res.json();
          setCurrentWeather({ ...data, districtName: 'Kandy' });
          setIsLiveMode(true);
        } else {
          const demo = getDemoWeatherData(kandy || sriLankanDistricts[0]);
          setCurrentWeather(demo);
          setIsLiveMode(false);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadKandy();
    // Preload other cities in background (non-blocking)
    fetchAllWeatherData();
  }, []);

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="weather-header">
          <h3>🌤️ Sri Lanka Weather</h3>
        </div>
        <div className="weather-loading">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <div className="weather-header">
          <h3>🌤️ Sri Lanka Weather</h3>
        </div>
        <div className="weather-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchAllWeatherData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget" style={{ ['--weather-bg-url']: "url('/weather-bg.jpg')" }}>
      <div className="weather-content">
      <div className="weather-header">
        <h3>🌤️ Sri Lanka Weather</h3>
        <p className="weather-subtitle">Agricultural regions weather update</p>
      </div>

      {/* Current location weather card */}
      {currentWeather && (
        <div className="weather-grid">
          <div
            className={`weather-card ${selectedDistrict === 'current' ? 'selected' : ''}`}
            onClick={() => setSelectedDistrict(selectedDistrict === 'current' ? null : 'current')}
          >
            <div className="weather-card-header">
              <h4>{currentWeather.districtName || 'Current Location'}</h4>
              <img
                src={getWeatherIcon(currentWeather.weather[0].icon)}
                alt={currentWeather.weather[0].description}
                className="weather-icon"
              />
            </div>
            <div className="weather-temp">{Math.round(currentWeather.main.temp)}°C</div>
            <div className="weather-description">{currentWeather.weather[0].description}</div>
            {selectedDistrict === 'current' && (
              <div className="weather-details">
                <div className="detail-row">
                  <span>Feels like:</span>
                  <span>{Math.round(currentWeather.main.feels_like)}°C</span>
                </div>
                <div className="detail-row">
                  <span>Humidity:</span>
                  <span>{currentWeather.main.humidity}%</span>
                </div>
                <div className="detail-row">
                  <span>Wind Speed:</span>
                  <span>{Math.round(currentWeather.wind.speed * 3.6)} km/h</span>
                </div>
                <div className="detail-row">
                  <span>Pressure:</span>
                  <span>{currentWeather.main.pressure} hPa</span>
                </div>
                {currentWeather.sys?.sunrise && (
                  <div className="detail-row">
                    <span>Sunrise:</span>
                    <span>{formatTime(currentWeather.sys.sunrise)}</span>
                  </div>
                )}
                {currentWeather.sys?.sunset && (
                  <div className="detail-row">
                    <span>Sunset:</span>
                    <span>{formatTime(currentWeather.sys.sunset)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle other cities */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <button
          className={`toggle-btn ${animateToggle ? 'pulse' : ''}`}
          onClick={() => {
            setShowAllCities(v => !v);
            setAnimateToggle(true);
            setTimeout(() => setAnimateToggle(false), 350);
          }}
        >
          {showAllCities ? 'Hide other cities' : 'Show other cities'}
        </button>
      </div>

      {showAllCities && (
        <div className="weather-grid">
          {weatherData.map((weather, index) => (
            <div
              key={index}
              className={`weather-card ${selectedDistrict === index ? 'selected' : ''}`}
              onClick={() => setSelectedDistrict(selectedDistrict === index ? null : index)}
            >
              <div className="weather-card-header">
                <h4>{weather.districtName}</h4>
                <img
                  src={getWeatherIcon(weather.weather[0].icon)}
                  alt={weather.weather[0].description}
                  className="weather-icon"
                />
              </div>
              <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather-description">{weather.weather[0].description}</div>
              {selectedDistrict === index && (
                <div className="weather-details">
                  <div className="detail-row">
                    <span>Feels like:</span>
                    <span>{Math.round(weather.main.feels_like)}°C</span>
                  </div>
                  <div className="detail-row">
                    <span>Humidity:</span>
                    <span>{weather.main.humidity}%</span>
                  </div>
                  <div className="detail-row">
                    <span>Wind Speed:</span>
                    <span>{Math.round(weather.wind.speed * 3.6)} km/h</span>
                  </div>
                  <div className="detail-row">
                    <span>Pressure:</span>
                    <span>{weather.main.pressure} hPa</span>
                  </div>
                  <div className="detail-row">
                    <span>Sunrise:</span>
                    <span>{formatTime(weather.sys.sunrise)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Sunset:</span>
                    <span>{formatTime(weather.sys.sunset)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="weather-footer">
        <p>Click on any card for detailed information</p>
        <p className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
