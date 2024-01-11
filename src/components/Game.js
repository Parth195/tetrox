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

    const increaseDifficulty = () => {
        // Increase the number of shapes
        let fitCount = document.querySelectorAll(`.${styles.additionalShape}`).length;
        let numberOfShapes = fitCount % 10 === 0 ? 2 : 1; // Increase shapes every 10 fits

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

    const isInsideHole = () => {
        let holeElement = document.getElementById(styles.hole);

        if (holeElement) {
            let shapes = document.querySelectorAll(`.${styles.additionalShape}`);
            let hole = holeElement.getBoundingClientRect();

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
