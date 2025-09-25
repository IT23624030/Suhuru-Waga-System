import React, { useState, useEffect } from 'react';
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import Footer from "../Home/Footer/Footer";
import axios from 'axios';
import VNotice from './VNotice';
import './VNotices.css';

const URL = 'http://localhost:5000/notices';

const fetchNotices = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching notices:', error);
    return { notices: [] };
  }
};

const benefitsText = "   Timely updates, Easy access to vital information, and Efficient communication.";

function VNotices() {
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    fetchNotices().then((data) => setNotices(data.notices));
  }, []);

  useEffect(() => {
    let i = 0;
    setTypingText(''); // Reset text on component mount
    const typingEffect = setInterval(() => {
      if (i < benefitsText.length) {
        setTypingText((prev) => prev + benefitsText.charAt(i));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 50); // Adjust typing speed here
    return () => clearInterval(typingEffect);
  }, []);

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <div className="notices-hero-image">
        <Navi />
        <div className="hero-text-container">
          <h1 className="hero-title">Government Notices</h1>
          <div className="typing-container">
            <span className="typing-text">{typingText}</span>
          </div>
        </div>
      </div>
      <div className="notices-container">
        <div className="intro-section">
          <h2 className="section-title">Latest Updates</h2>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notices..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="notice-list">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, i) => (
              <div key={i} className="notice-card">
                <VNotice notice={notice} />
              </div>
            ))
          ) : (
            <p className="no-notices-message">No notices to display.</p>
          )}
        </div>
      </div>
      <Footer /> 
    </div>
  );
}

export default VNotices;