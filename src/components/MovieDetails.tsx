import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

interface Actor {
  person: { name: string; image: { medium: string } };
  character: { name: string };
}

interface Show {
  id: number;
  name: string;
  image: { medium: string };
  summary: string;
  genres: string[];
  rating: { average: number };
  _embedded: { cast: Actor[] };
}

const generateStars = (rating: number): string => {
  const roundedRating = Math.floor(rating);
  return '★'.repeat(roundedRating);
};

const MovieDetails: React.FC = () => {
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${id}?embed=cast`);
        setShow(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching show details:', error);
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`);
        if (response.data && response.data.length > 0) {
          navigate(`/search/${encodeURIComponent(searchTerm)}`);
        } else {
          navigate('/try-again');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        navigate('/try-again');
      }
    }
  };

  const handleGoBack = () => {
    if (searchTerm) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/tvapp');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!show) {
    return <div>No information available.</div>;
  }

  return (
    <div>
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
      <div className="button-space">
        <button onClick={handleGoBack} className="back-to-search-btn"> Back to Search</button>
      </div>
      <h1>Movie Details</h1>
      <div className="movie-details-div">
        <div className="movie-details-div-left">
          {show.image && show.image.medium && (
            <img src={show.image.medium} alt={show.name} />
          )}
        </div>
        <div className="movie-details-div-right">
          <div className="movie-details-div-right-up">
            <h2>{show.name}</h2>
            <p>Rating: <span style={{color: 'rgb(177, 160, 66)'}}>{generateStars(show.rating.average)}</span></p>
            <p>Genres: {show.genres.join(', ')}</p>
            <div dangerouslySetInnerHTML={{ __html: show.summary }} />
          </div>
          <div className="movie-details-div-right-down">
            <h3>Cast</h3>
            <div className="cast-list">
              {show._embedded.cast.map((actor, index) => (
                <div key={index} className="actor-card">
                  {actor.person.image && actor.person.image.medium && (
                    <img src={actor.person.image.medium} alt={actor.person.name} className="actor-image" />
                  )}
                  <div className="actor-info">
                    <p className="actor-name">{actor.person.name}</p>
                    <p className="actor-role">as {actor.character.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;