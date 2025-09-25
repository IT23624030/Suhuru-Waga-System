import React, { useState } from "react";
import "./Search.css";

export default function SearchBar() {
  const [showDestination, setShowDestination] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  const [destination, setDestination] = useState("Destination, hotel name");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  return (
    <div className="searchbar">
      {/* Destination */}
      <div className="field" onClick={() => setShowDestination(!showDestination)}>
        <label>Going to</label>
        <span>{destination}</span>
        {showDestination && (
          <div className="dropdown">
            <input
              type="text"
              placeholder="Enter destination"
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Check-in */}
      <div className="field" onClick={() => setShowCheckIn(!showCheckIn)}>
        <label>Check-in</label>
        <span>{checkIn || "mm/dd/yyyy"}</span>
        {showCheckIn && (
          <div className="dropdown">
            <input
              type="date"
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Check-out */}
      <div className="field" onClick={() => setShowCheckOut(!showCheckOut)}>
        <label>Check-out</label>
        <span>{checkOut || "mm/dd/yyyy"}</span>
        {showCheckOut && (
          <div className="dropdown">
            <input
              type="date"
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="field" onClick={() => setShowGuests(!showGuests)}>
        <label>Guests</label>
        <span>{guests} Guests</span>
        {showGuests && (
          <div className="dropdown guests">
            <button onClick={() => setGuests((g) => Math.max(1, g - 1))}>-</button>
            <span>{guests}</span>
            <button onClick={() => setGuests((g) => g + 1)}>+</button>
          </div>
        )}
      </div>

      {/* Search */}
      <button className="search-btn">Search</button>
    </div>
  );
}