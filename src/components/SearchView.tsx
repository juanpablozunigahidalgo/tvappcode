import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom'; // Import Link and useParams from react-router-dom
import axios from 'axios';
import './SearchView.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

interface Show {
  id: number;
  name: string;
  image: { medium: string } | null;
  rating: { average: number };
}

const SearchView: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const location = useLocation();
  const params = useParams<{ searchTerm: string }>(); // Get the search term from params
  const navigate = useNavigate(); 

  const generateStars = (rating: number): string => {
    const roundedRating = Math.floor(rating);
    return '★'.repeat(roundedRating);
  };

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(params.searchTerm ?? '')}`
        );
        console.log('JSON Response:', response.data);
        setShows(response.data.map((result: any) => result.show));
        setError(false);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setError(true);
      }
    };

    fetchShows();
  }, [params.searchTerm]);

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
      {error || shows.length === 0 ? (
        <div className="no-shows-message">
          No TV Show found with that name. Either there was an error in the database. Please try again.
        </div>
      ) : (
        <div className="show-grid-wrapper-SV">
          <div className="show-grid">
            {shows.map((show) => (
              <Link key={show.id} to={`/details/${params.searchTerm}/${show.id}`} className="show-card-link">
                <div className="show-card">
                  {show.image && show.image.medium ? (
                    <img src={show.image.medium} alt={show.name} />
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                  <h3>{show.name}</h3>
                  <p className="rating-stars">{show.rating ? generateStars(show.rating.average) : 'N/A'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchView;