import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M21 21L16.5 16.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => onSearchChange('')}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
