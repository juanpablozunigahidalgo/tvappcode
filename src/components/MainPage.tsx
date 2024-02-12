import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './MainPage.css'; // Import the CSS file

const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`);
        console.log('API Response:', response.data); // Log the API response
        if (response.data && response.data.length > 0) {
          // Navigate to the search route with the search term
          navigate(`/search/${encodeURIComponent(searchTerm)}`);
        } else {
          // Navigate to the try-again route if no results found
          navigate('/try-again');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        // Navigate to the try-again route if an error occurs
        navigate('/try-again');
      }
    }
  };

  return (
    <div className="main-page-container">
      <img src="https://static.tvmaze.com/images/tvm-header-logo.png" alt="Logo" className="llogo" /> {/* Adjust the path to your logo */}
      <div className="main-page-content">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter movie name..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
    </div>
  );
};

export default MainPage;