import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/game.module.css';

const Game = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a 3-second loading time
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      initializeGame();

      const updatePosition = (event) => {
        // Your device orientation logic here
      };

      window.addEventListener('deviceorientation', updatePosition);

      return () => {
        window.removeEventListener('deviceorientation', updatePosition);
      };
    }
  }, [loading]);

  const initializeGame = () => {
    resetGame();
  };

  const resetGame = () => {
    // Reset game elements to their initial positions and appearances
    document.getElementById(styles.gameContainer).style.transform = "translate3d(0, 0, 0)";
    setElementStyles(styles.shape, { left: '50%', top: '50%', backgroundColor: '#fff' });
    setElementStyles(styles.hole, { left: '40%', top: '40%', backgroundColor: '#fff' });

    // Remove all additional shapes
    let additionalShapes = document.querySelectorAll(`.${styles.additionalShape}`);
    additionalShapes.forEach(shape => shape.remove());

    // Generate a new random position for the hole
    let randomHoleX = Math.floor(Math.random() * (window.innerWidth - 60));
    let randomHoleY = Math.floor(Math.random() * (window.innerHeight - 60));
    setElementStyles(styles.hole, { left: `${randomHoleX}px`, top: `${randomHoleY}px` });

    // Generate a new random position for the main shape
    let randomShapeX = Math.floor(Math.random() * (window.innerWidth - 50));
    let randomShapeY = Math.floor(Math.random() * (window.innerHeight - 50));
    setElementStyles(styles.shape, { left: `${randomShapeX}px`, top: `${randomShapeY}px` });
  };

  const setElementStyles = (elementId, styles) => {
    const element = document.getElementById(elementId);
    if (element) {
      Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value;
      });
    }
  };

  const increaseDifficulty = () => {
    // Increase the number of shapes
    let fitCount = document.querySelectorAll(`.${styles.additionalShape}`).length;
    let numberOfShapes = fitCount % 20 === 0 ? 2 : 1; // Increase shapes every 20 fits

    for (let i = 0; i < numberOfShapes; i++) {
      createNewShape();
    }

    // Adjust the hole position
    let randomHoleX = Math.floor(Math.random() * (window.innerWidth - 60));
    let randomHoleY = Math.floor(Math.random() * (window.innerHeight - 60));
    setElementStyles(styles.hole, { left: `${randomHoleX}px`, top: `${randomHoleY}px` });
  };

  const createNewShape = () => {
    let newShape = document.createElement("div");
    newShape.className = styles.additionalShape;
    document.getElementById(styles.gameContainer).appendChild(newShape);
  };

  return (
    <div id={styles.gameContainer}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <BeatLoader color="#3498db" size={20} margin={5} />
        </div>
      ) : (
        <>
          <div id={styles.shape}></div>
          <div id={styles.hole}></div>
        </>
      )}
    </div>
  );
};

export default Game;
