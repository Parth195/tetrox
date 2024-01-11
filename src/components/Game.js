// components/Game.js

import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/game.module.css';

const Game = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a 3-second loading time
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            initializeGame();

            const updatePosition = (event) => {
                let x = event.beta;   // Get the rotation around the x-axis
                let y = event.gamma;  // Get the rotation around the y-axis
                let z = event.alpha;  // Get the rotation around the z-axis

                // Adjust the game container position based on device orientation
                setElementStyles(styles.gameContainer, { transform: `translate3d(${x}px, ${y}px, ${z}px)` });

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
        setElementStyles(styles.gameContainer, { transform: "translate3d(0, 0, 0)" });
        setElementStyles(styles.shape, getRandomShapePosition());
        setElementStyles(styles.hole, { left: '40%', top: '40%', backgroundColor: '#fff' });

        // Remove all additional shapes
        let additionalShapes = document.querySelectorAll(`.${styles.additionalShape}`);
        additionalShapes.forEach(shape => shape.remove());
    };

    const setElementStyles = (elementClassName, styles) => {
        const elements = document.getElementsByClassName(elementClassName);
        if (elements.length > 0) {
            Array.from(elements).forEach(element => {
                Object.entries(styles).forEach(([property, value]) => {
                    element.style[property] = value;
                });
            });
        }
    };

    const getRandomShapePosition = () => {
        let randomX = Math.floor(Math.random() * (window.innerWidth - 50));
        let randomY = Math.floor(Math.random() * (window.innerHeight - 50));
        return { left: `${randomX}px`, top: `${randomY}px`, backgroundColor: '#fff' };
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
        setElementStyles(styles.gameContainer, getRandomShapePosition());
        document.getElementById(styles.gameContainer).appendChild(newShape);
    };

    const isInsideHole = () => {
        let holeElement = document.getElementById(styles.hole);

        if (holeElement) {
            let hole = holeElement.getBoundingClientRect();
            let shapes = document.querySelectorAll(`.${styles.additionalShape}`);

            for (let shape of shapes) {
                let shapeRect = shape.getBoundingClientRect();

                if (
                    shapeRect.left >= hole.left &&
                    shapeRect.right <= hole.right &&
                    shapeRect.top >= hole.top &&
                    shapeRect.bottom <= hole.bottom
                ) {
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
                    <div className={styles.shape}></div>
                    <div className={styles.hole}></div>
                </>
            )}
        </div>
    );
};

export default Game;
