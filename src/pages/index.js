import Head from 'next/head';
import Game from '@/components/Game';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Shape Fitter Game</title>
      </Head>

      <main>
        <Game />
      </main>
    </div>
  );
}
