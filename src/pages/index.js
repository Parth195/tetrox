// pages/index.js

import React,{ useState } from 'react';
import Head from 'next/head';
import Game from '../components/Game';

const Home = () => {
  const [currentLevel,setCurrentLevel] = useState(1);
  const [score,setScore] = useState(0);

  const handleLevelChange = (newLevel) => {
    setCurrentLevel(newLevel);
  };

  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  return (
    <div>
      <Head>
        <title>TETROX</title>
      </Head>

      <main>
        <h1>TETROX</h1>
        <p>Level: {currentLevel}</p>
        <p>Score: {score}</p>
        <Game onLevelChange={handleLevelChange} onScoreChange={handleScoreChange} />
      </main>
    </div>
  );
};

export default Home;
