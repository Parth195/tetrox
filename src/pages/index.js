// pages/index.js

import React, { useState } from 'react';
import Head from 'next/head';
import Game from '../components/Game';

const Home = () => {
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLevelChange = (newLevel) => {
    setCurrentLevel(newLevel);
  };

  return (
    <div>
      <Head>
        <title>TETROX</title>
      </Head>

      <main>
        <h1>TETROX</h1>
        <p>Level: {currentLevel}</p>
        <Game onLevelChange={handleLevelChange} />
      </main>
    </div>
  );
};

export default Home;
