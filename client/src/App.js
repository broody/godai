import React, { useState } from 'react';
import Landing from './Landing';
import Game from './Game';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handlePlay = () => {
    setCurrentPage('game');
  };

  const handleBack = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="app">
      {currentPage === 'landing' ? (
        <Landing onPlay={handlePlay} />
      ) : (
        <>
          <button className="back-button" onClick={handleBack}>
            ← Back to Home
          </button>
          <Game />
        </>
      )}
    </div>
  );
}

export default App;
