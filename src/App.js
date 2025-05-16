import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJoke = async () => {
    setLoading(true);
    setError('');
    try {
      // API request for a work-friendly joke
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
        params: {
          type: 'single',    // Fetch a single-line joke
          blacklistFlags: 'explicit,racist,sexist,nsfw,religious,political', // Filter out explicit, racist, or sexist jokes
        },
      });

      // Checking if the joke is of type 'single' or 'twopart'
      if (response.data.type === 'single') {
        setJoke(response.data.joke);
      } else {
        setJoke(`${response.data.setup} - ${response.data.delivery}`);
      }
    } catch (err) {
      setError('Oops! Something went wrong while fetching the joke.');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Work-Friendly Joke Generator</h1>
      <div className="joke-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {joke && !loading && !error && <p>{joke}</p>}
        {!joke && !loading && !error && <p>Click the button for a joke!</p>}
      </div>
      <button className="generate-joke-button" onClick={fetchJoke}>
        Generate New Joke
      </button>
    </div>
  );
}

export default App;
