// components/Game.js

import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/game.module.css';

const Game = () => {
    const [loading, setLoading] = useState(true);
    const [shapeStyles, setShapeStyles] = useState({
        left: '40%',
        top: '40%',
        backgroundColor: '#fff'
    });
    const [holeStyles, setHoleStyles] = useState({
        left: '40%',
        top: '40%',
        backgroundColor: '#fff'
    });

    useEffect(() => {
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
                let x = event.gamma;
                let y = event.beta;

                x = x / 10;
                y = y / 10;

                setShapeStyles(prevStyles => {
                    const newLeft = parseFloat(prevStyles.left) + x;
                    const newTop = parseFloat(prevStyles.top) + y;

                    const boundedLeft = Math.max(0, Math.min(100, newLeft));
                    const boundedTop = Math.max(0, Math.min(100, newTop));

                    return {
                        left: `${boundedLeft}%`,
                        top: `${boundedTop}%`,
                        backgroundColor: '#fff'
                    };
                });
            };

            window.addEventListener('deviceorientation', updatePosition);

            return () => {
                window.removeEventListener('deviceorientation', updatePosition);
            };
        }
    }, [loading]);

    useEffect(() => {
        // Check if the shape is inside the hole separately from motion update
        if (isInsideHole()) {
            // Handle successful placement (show response when the shape is hidden inside the hole)
            alert("Shape fitted! You win!");

            // Reset the game
            resetGame();

            // Check for level increase every 10 fits
            increaseDifficulty();
        }
    }, [shapeStyles]);

    const initializeGame = () => {
        resetGame();
    };

    const resetGame = () => {
        setShapeStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });
        setHoleStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });

        let additionalShapes = document.querySelectorAll(`.${styles.additionalShape}`);
        additionalShapes.forEach(shape => shape.remove());
    };

    const increaseDifficulty = () => {
        let fitCount = document.querySelectorAll(`.${styles.additionalShape}`).length;
        let numberOfShapes = fitCount % 10 === 0 ? 2 : 1;

        for (let i = 0; i < numberOfShapes; i++) {
            createNewShape();
        }
    };

    const createNewShape = () => {
        let newShape = document.createElement("div");
        newShape.className = styles.additionalShape;
        setElementStyles(newShape, getRandomShapePosition());
        document.getElementById(styles.gameContainer).appendChild(newShape);
    };

    const isInsideHole = () => {
        let holeElement = document.getElementById(styles.hole);

        if (holeElement) {
            let hole = holeElement.getBoundingClientRect();
            let shape = document.querySelector(`.${styles.additionalShape}`);

            if (shape) {
                let shapeRect = shape.getBoundingClientRect();

                return (
                    shapeRect.left >= hole.left &&
                    shapeRect.right <= hole.right &&
                    shapeRect.top >= hole.top &&
                    shapeRect.bottom <= hole.bottom
                );
            }
        }

        return false;
    };

    return (
        <div className={styles.gameContainer}>
            {loading ? (
                <div className={styles.loaderContainer}>
                    <BeatLoader color="#3498db" size={20} margin={5} />
                </div>
            ) : (
                <>
                    <div className={styles.shape} style={shapeStyles}></div>
                    <div className={styles.hole} style={holeStyles}></div>
                </>
            )}
        </div>
    );
};

export default Game;
