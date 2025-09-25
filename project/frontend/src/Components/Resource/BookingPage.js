import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingPage.css';
import SriLankaMap from './SriLankaMap';
import Nav from "./Nav/Nav2";
import Footer from './Footer/Footer';

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [bookingMap, setBookingMap] = useState({});
  const [farmerId, setFarmerId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    email: '',
    date: null,
    duration: '',
    partialPayment: false,
  });

  const [errors, setErrors] = useState({});

  // --- Load logged-in user ---
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/users/me', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch user info.');

          const data = await res.json();
          setFarmerId(data._id);
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            contact_number: data.contactNumber || '',
            email: data.email || '',
          }));
        } catch (err) {
          console.error(err);
          setErrorMessage(err.message);
        }
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setFarmerId(userData._id);
          setFormData(prev => ({
            ...prev,
            name: userData.fullname || '',
            email: userData.email || '',
          }));
        } else {
          setErrorMessage('You must be logged in to book.');
          navigate('/login');
        }
      }
    };
    fetchUser();
  }, [navigate]);

  // --- Fetch resource details ---
  useEffect(() => {
    fetch(`http://localhost:5000/resources/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch resource'))
      .then(data => {
        setResource(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Failed to load resource details.');
        setLoading(false);
      });
  }, [id]);

  // --- Fetch bookings for this resource ---
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/bookings/resource/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch bookings'))
      .then(bookings => {
        const map = {};
        bookings.forEach(b => {
          const d = new Date(b.date);
          const dayStr = d.toISOString().split('T')[0];
          if (!map[dayStr]) map[dayStr] = { confirmed: 0, pending: 0 };
          if (b.status === 'Confirmed') map[dayStr].confirmed += 1;
          else if (b.status === 'Pending') map[dayStr].pending += 1;
        });
        setBookingMap(map);
      })
      .catch(err => console.error('Error fetching bookings:', err));
  }, [id]);

  // --- Compute total amount ---
  useEffect(() => {
    if (resource && formData.duration) {
      const hours = parseFloat(formData.duration);
      setTotalAmount(!isNaN(hours) ? resource.pricing?.baseRate * hours : 0);
    } else {
      setTotalAmount(0);
    }
  }, [formData.duration, resource]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!/^[a-zA-Z\s]+$/.test(formData.name)) newErrors.name = 'Name should contain only letters and spaces.';
    if (!/^\d{10}$/.test(formData.contact_number)) newErrors.contact_number = 'Contact number must be 10 digits.';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address.';
    if (!formData.duration || parseFloat(formData.duration) < 1) newErrors.duration = 'Duration must be at least 1 hour.';
    if (!formData.date) newErrors.date = 'Date is required.';
    else {
      const today = new Date();
      today.setHours(0,0,0,0);
      if (formData.date < today) newErrors.date = 'Date cannot be in the past.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;
    if (!farmerId) return setErrorMessage('User ID not loaded yet. Please wait.');

    const bookingRequest = {
      resourceId: id,
      totalAmount,
      partialPayment: formData.partialPayment,
      date: formData.date,
      durationHours: parseFloat(formData.duration),
      deliveryLocation: selectedLocation,
      farmerId,
      farmerName: formData.name,
      farmerContact: formData.contact_number,
      farmerEmail: formData.email,
    };

    try {
      const res = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingRequest),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Booking failed: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const data = await res.json();
      console.log('Booking successful:', data);
      setSuccessMessage('Booking request submitted! You can confirm your booking in your profile.');
      navigate(-1);

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Booking could not be processed.');
    }
  };

  if (loading) return <p className="bp-error">Loading...</p>;
  if (errorMessage) return <p className="bp-error">{errorMessage}</p>;
  if (!resource) return <p className="bp-error">Resource not found.</p>;

  const today = new Date();
  today.setHours(0,0,0,0);

  return (
    <div className="bp-body">
      <Nav />
      <div className="bp-page">
        <h2>{resource.name}</h2>
        <img
          src={resource.imageUrl || `https://placehold.co/600x400/D1E7DD/285B37?text=${encodeURIComponent(resource.name)}`}
          alt={`Image of ${resource.name}`}
          className="bp-resource-image"
        />
        <p><strong>Price:</strong> {resource.pricing?.baseRate || 'N/A'} per hour</p>
        <p><strong>Description:</strong> {resource.description || 'No description available.'}</p>
        <p><strong>Availability:</strong> {resource.availability ? `${resource.availability.availableUnits} / ${resource.availability.totalUnits} units available` : 'Not available'}</p>

        <form className="bp-form" onSubmit={handleSubmit}>
          <label>
            Your Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            {errors.name && <span className="bp-error">{errors.name}</span>}
          </label>
          <label>
            Contact Number:
            <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} required />
            {errors.contact_number && <span className="bp-error">{errors.contact_number}</span>}
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <span className="bp-error">{errors.email}</span>}
          </label>

          <label>
            Select Date:
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData(prev => ({ ...prev, date }))}
              inline
              minDate={new Date()}
              renderCustomHeader={({ date }) => (
                <div style={{ textAlign: "center", padding: "0.5rem", fontWeight: "bold", color: "#256029" }}>
                  {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
                </div>
              )}
              filterDate={(date) => {
                const dayStr = date.toISOString().split("T")[0];
                const stats = bookingMap[dayStr];
                const totalUnits = resource.availability?.totalUnits || 0;
                if (stats) {
                  if (stats.confirmed >= totalUnits) return false; // block fully booked
                  if (stats.pending > 0) return false; // block pending
                }
                return true;
              }}
              dayClassName={(date) => {
                const dayStr = date.toISOString().split("T")[0];
                const stats = bookingMap[dayStr];
                const totalUnits = resource.availability?.totalUnits || 0;
                if (stats) {
                  if (stats.confirmed >= totalUnits) return "bp-fully-booked-day";
                  if (stats.pending > 0) return "bp-pending-booking-day";
                  if (stats.confirmed > 0 && stats.confirmed < totalUnits) return "bp-partially-booked-day";
                }
                if (date.toDateString() === today.toDateString()) return "bp-today-day";
                return "";
              }}
              renderDayContents={(day, date) => {
                const dayStr = date.toISOString().split("T")[0];
                const stats = bookingMap[dayStr];
                const totalUnits = resource.availability?.totalUnits || 0;
                const tooltip = stats
                  ? `Confirmed: ${stats.confirmed}, Pending: ${stats.pending}, Available: ${totalUnits - stats.confirmed}`
                  : "Available";
                return <span title={tooltip}>{day}</span>;
              }}
            />
            {errors.date && <span className="bp-error">{errors.date}</span>}
          </label>

          {/* ✅ Legend */}
          <div className="bp-calendar-legend">
            <div className="bp-legend-items">
              <div className="bp-legend-item">
                <span className="bp-legend-color available"></span> Available
              </div>
              <div className="bp-legend-item">
                <span className="bp-legend-color today"></span> Today
              </div>
              <div className="bp-legend-item">
                <span className="bp-legend-color pending"></span> Pending Booking (Blocked)
              </div>
              <div className="bp-legend-item">
                <span className="bp-legend-color partial"></span> Partially Booked
              </div>
              <div className="bp-legend-item">
                <span className="bp-legend-color fully-booked"></span> Fully Booked
              </div>
            </div>
          </div>

          <label>
            Duration (hours):
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" required />
            {errors.duration && <span className="bp-error">{errors.duration}</span>}
          </label>

          <h4>Select Delivery Location:</h4>
          <SriLankaMap position={selectedLocation} setPosition={setSelectedLocation} />
          <button type="button" className="bp-location-btn" onClick={async () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setSelectedLocation({ lat: latitude, lng: longitude });
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                  const data = await res.json();
                  setDeliveryAddress(data.display_name || 'Address not found');
                } catch (err) {
                  console.error(err);
                  setDeliveryAddress('Address not found');
                }
              }, () => alert('Unable to access your location.'));
            } else alert('Geolocation not supported.');
          }}>📍 Use My Current Location</button>
          {deliveryAddress && <p><strong>Address:</strong> {deliveryAddress}</p>}

          <p><strong>Total Amount:</strong> Rs. {totalAmount.toFixed(2)}</p>
          <div className="bp-inline-checkbox">
            <input
              type="checkbox"
              name="partialPayment"
              checked={formData.partialPayment}
              onChange={handleChange}
            />
            <span>Confirm with Partial Payment</span>
          </div>
          <p className="bp-info-text">Partial payment allows you to confirm the booking by paying <strong>50%</strong> of the total amount upfront.</p>

          <button type="submit" className="bp-submit-btn">Submit Booking</button>
        </form>

        {successMessage && <p className="bp-success">{successMessage}</p>}
        {errorMessage && <p className="bp-error">{errorMessage}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;
