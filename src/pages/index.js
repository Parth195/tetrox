// pages/index.js

import React from 'react';
import Head from 'next/head';
import Game from '../components/Game';

const Home = () => {
  return (
    <div>
      <Head>
        <title>TETROX</title>
      </Head>

      <main>
        <h1>TETROX</h1>
        <Game />
      </main>
    </div>
  );
};

export default Home;
