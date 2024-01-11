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
                let x = event.gamma; // Use gamma for horizontal movement
                let y = event.beta;  // Use beta for vertical movement

                // Adjust the sensitivity and scale the values
                x = x / 10;
                y = y / 10;

                // Update the shape position based on device orientation
                setShapeStyles(prevStyles => {
                    // Calculate the new position
                    const newLeft = parseFloat(prevStyles.left) + x;
                    const newTop = parseFloat(prevStyles.top) + y;

                    // Bound the shape within the screen limits
                    const boundedLeft = Math.max(0, Math.min(100, newLeft));
                    const boundedTop = Math.max(0, Math.min(100, newTop));

                    return {
                        left: `${boundedLeft}%`,
                        top: `${boundedTop}%`,
                        backgroundColor: '#fff'
                    };
                });

                // Check if the shape is inside the hole
                if (isInsideHole()) {
                    // Handle successful placement
                    alert("Shape fitted! You win!");

                    // Check for level increase every 10 fits
                    increaseDifficulty();

                    // Reset the game
                    resetGame();
                }
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
        setShapeStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });
        // Set the hole's initial position without modifying left and top
        setHoleStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });

        // Remove all additional shapes
        let additionalShapes = document.querySelectorAll(`.${styles.additionalShape}`);
        additionalShapes.forEach(shape => shape.remove());
    };

    const increaseDifficulty = () => {
        // Increase the number of shapes
        let fitCount = document.querySelectorAll(`.${styles.additionalShape}`).length;
        let numberOfShapes = fitCount % 10 === 0 ? 2 : 1; // Increase shapes every 10 fits

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

                if (
                    shapeRect.left >= hole.left &&
                    shapeRect.right <= hole.right &&
                    shapeRect.top >= hole.top &&
                    shapeRect.bottom <= hole.bottom
                ) {
                    // Shape is inside the hole
                    setTimeout(() => {
                        // Delay the alert for 2 seconds
                        alert("Shape fitted! You win!");
                    }, 1000);

                    return true;
                }
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
