import React, { useEffect, useState } from "react"; 
import "./AvailableResources.css";
import { useNavigate, useLocation } from 'react-router-dom';

function AvailableResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(7); // show 8 cards initially

  const navigate = useNavigate();
  const location = useLocation();

  const handleRequestClick = (id) => {
    navigate(`/request/${id}`);
  };

  useEffect(() => {
    fetch("http://localhost:5000/resources")
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          let updatedResources = [...data];

          // Check if a new resource was passed via navigation state
          if (location.state && location.state.newResource) {
            const newResource = location.state.newResource;
            // Append the new resource with local image preview to the top
            updatedResources = [newResource, ...updatedResources];
          }

          setResources(updatedResources);
          setErrorMessage('');
        } else if (data.message) {
          setResources([]);
          setErrorMessage(data.message);
        } else {
          setResources([]);
          setErrorMessage('Unexpected data format');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
        setLoading(false);
        setErrorMessage('Failed to load resources');
      });
  }, [location.state]);

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <section className="available-resources">
      <h2>Available Resources</h2>

      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <>
          <div className="resource-grid">
            {resources.slice(0, visibleCount).map((r, i) => (
              <div key={i} className="resource-card">
                <img
                  src={r.imagePreview || r.imageUrl || 'https://placehold.co/400x300/D1E7DD/285B37?text=No+Image'} 
                  alt={`Image of ${r.name}`} 
                  className="resource-card-image"
                />
                <h3>{r.name}</h3>
                <p>Price: rs.{r.pricing?.baseRate}</p>
                <button className="btn" onClick={() => handleRequestClick(r._id)}>Request</button>
              </div>
            ))}

            <div
              className="resource-card add-new"
              onClick={() => navigate("/add-resource")}
              style={{ cursor: "pointer" }}
            >
              <div className="plus-icon">+</div>
              <p>Add Your Resource</p>
            </div>
          </div>

          {(visibleCount < resources.length || visibleCount > 7) && (
            <div className="button-row">
              {visibleCount > 8 && (
                <button className="btn see-less" onClick={() => setVisibleCount(7)}>
                  See Less
                </button>
              )}
              {visibleCount < resources.length && (
                <button className="btn see-more" onClick={handleSeeMore}>
                  See More
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AvailableResources;