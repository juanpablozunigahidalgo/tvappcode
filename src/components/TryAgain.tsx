import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './TryAgain.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

interface Show {
  id: number;
  name: string;
  image: { medium: string };
  rating: { average: number };
}

const TryAgain: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const navigate = useNavigate(); 

  // Helper function to generate stars based on rating
  const generateStars = (rating: number): string => {
    const roundedRating = Math.floor(rating);
    return '★'.repeat(roundedRating);
  };

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
        );
        console.log('JSON Response:', response.data); // Log the JSON response
        setShows(response.data.map((result: any) => result.show));
        setError(false); // Reset error state
      } catch (error) {
        console.error('Error fetching shows:', error);
        setError(true); // Set error state to true
      }
    };

    fetchShows();
  }, [query]);

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
    <div className="search-view">
      <div className="header-SV">
        <img src="https://static.tvmaze.com/images/tvm-header-logo.png" alt="Logo" className="logo-SV" />
        <div className="main-page-content-due">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter movie name..."
            className="search-input-SV"
          />
          <button onClick={handleSearch} className="search-button-SV">Search</button>
        </div>
      </div>
      {error ? (
        <div className="no-shows-message">
          {searchTerm === '' ? (
            <div>
              <p>Please enter a search term.</p>
            </div>
          ) : (
            <div>
              <p>No TV Show found with that name. Please try again.</p>
            </div>
          )}
        </div>
      ) : shows.length === 0 ? (
        <div className="no-shows-message">
          <p>TRY AGAIN in the search field.</p>
        </div>
      ) : (
        <div className="show-grid-wrapper">
          <div className="show-grid">
            {shows.map((show) => (
              <div key={show.id} className="show-card">
                <img src={show.image.medium} alt={show.name} />
                <h3>{show.name}</h3>
                <p className="rating-stars">{show.rating ? generateStars(show.rating.average) : 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TryAgain;