import Nav from '../Nav/Nav';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Notice from './Notice';
import './Notices.css';

const URL = 'http://localhost:5000/notices';

const fetchNotices = async () => {
    try {
        return await axios.get(URL).then((response) => response.data);
    } catch (error) {
        console.error('Error fetching notices:', error);
        return { notices: [] };
    }
};

const benefitsText = "    Timely updates, Easy access to vital information, and Efficient communication.";

function Notices() {
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

    const handleDelete = (id) => {
        setNotices(prev => prev.filter(notice => notice._id !== id));
    };

    const filteredNotices = notices.filter(notice =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Nav />
            <div className="notices-hero-image">
                <div className="hero-text-container">
                    <h1 className="hero-title">Government Notices</h1>
                    <div className="typing-container">
                        <span className="typing-text">{typingText}</span>
                    </div>
                </div>
            </div>
            <div className="notices-container">
                <div className="notices-header">
                    <h1>Manage Notices</h1>
                    <a href="/add-notice" className="add-notice-link">Add Notice</a>
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
                                <Notice notice={notice} onDelete={handleDelete} />
                            </div>
                        ))
                    ) : (
                        <p className="no-notices-message">No notices to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notices;