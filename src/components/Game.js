// components/Game.js

import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/game.module.css';

const Game = ({ onLevelChange }) => {
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
    const [level, setLevel] = useState(1);

    useEffect(() => {
        // Constants for sensitivity and cooldown
        const sensitivity = 10; // Adjust as needed
        const cooldownDuration = 1000; // 1 second cooldown, adjust as needed

        let lastAlignmentTime = 0;

        const updatePosition = (event) => {
            let x = event.gamma;
            let y = event.beta;

            x = x / sensitivity;
            y = y / sensitivity;

            setShapeStyles((prevStyles) => {
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

            // Check if the shape is inside the hole with a cooldown
            const currentTime = Date.now();
            if (currentTime - lastAlignmentTime > cooldownDuration && isInsideHole()) {
                // Handle successful placement (show response when the shape is hidden inside the hole)
                alert(`Level ${level} completed!`);

                // Increase the level
                setLevel(level + 1);

                // Notify parent component about level change
                onLevelChange(level + 1);

                // Reset the game
                resetGame();

                // Check for level increase every 10 fits
                increaseDifficulty();

                // Update the last alignment time
                lastAlignmentTime = currentTime;
            }
        };

        window.addEventListener('deviceorientation', updatePosition);

        return () => {
            window.removeEventListener('deviceorientation', updatePosition);
        };
    }, [loading, level]);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, []);

    const initializeGame = () => {
        resetGame();
    };

    const resetGame = () => {
        setShapeStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });
        setHoleStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });

        let additionalShapes = document.querySelectorAll(`.${styles.additionalShape}`);
        additionalShapes.forEach((shape) => shape.remove());
    };

    const increaseDifficulty = () => {
        let fitCount = document.querySelectorAll(`.${styles.additionalShape}`).length;
        let numberOfShapes = fitCount % 10 === 0 ? 2 : 1;

        for (let i = 0; i < numberOfShapes; i++) {
            createNewShape();
        }
    };

    const createNewShape = () => {
        let newShape = document.createElement('div');
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

                // Check if the center of the shape is inside the hole
                let shapeCenterX = shapeRect.left + shapeRect.width / 2;
                let shapeCenterY = shapeRect.top + shapeRect.height / 2;

                return (
                    shapeCenterX >= hole.left &&
                    shapeCenterX <= hole.right &&
                    shapeCenterY >= hole.top &&
                    shapeCenterY <= hole.bottom
                );
            }
        }

        return false;
    };

    const setElementStyles = (element, styles) => {
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
        });
    };

    const getRandomShapePosition = () => {
        let randomX = Math.floor(Math.random() * (window.innerWidth - 50));
        let randomY = Math.floor(Math.random() * (window.innerHeight - 50));
        return { left: `${randomX}px`, top: `${randomY}px`, backgroundColor: '#fff' };
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
