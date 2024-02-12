import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import MainPage from './components/MainPage'; // Import MainPage component
import SearchView from './components/SearchView'; // Import SearchView component
import MovieDetails from './components/MovieDetails'; // Import MovieDetails component
import TryAgain from './components/TryAgain';

function App() {
  return (
    <Router basename=""> {/* Wrap your routes with the Router component */}
      <Routes> {/* Use the Routes component to define your routes */}
        <Route path="/tvapp" element={<MainPage />} /> {/* Define a route for the root path, rendering MainPage */}
        <Route path="/search/:searchTerm" element={<SearchView />} /> {/* Define a route for "/search" path, rendering SearchView */}
        <Route path="/details/:searchTerm/:id" element={<MovieDetails/>} /> {/* Define a route for "/details/:id" path, rendering MovieDetails */}
        <Route path="/try-again" element={<TryAgain />} /> {/* Define a route for the root path, rendering MainPage */}
      </Routes>
    </Router>
  );
}

export default App; // Export the App component as default