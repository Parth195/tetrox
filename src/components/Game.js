// components/Game.js

import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/game.module.css';

const Game = ({ onLevelChange }) => {
    const [loading, setLoading] = useState(true);
    const [shapeStyles, setShapeStyles] = useState({
        left: '40%',
        top: '40%',
        backgroundColor: '#fff',
        zIndex: 1, // Ensure the shape is rendered above other elements
    });
    const [holeStyles, setHoleStyles] = useState({
        left: '40%',
        top: '40%',
        backgroundColor: '#fff',
    });
    const [level,setLevel] = useState(1);
    const [score,setScore] = useState(0);

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
                    ...prevStyles,
                    left: `${boundedLeft}%`,
                    top: `${boundedTop}%`,
                };
            });

            // Check if the shape is inside the hole with a cooldown
            const currentTime = Date.now();
            if (currentTime - lastAlignmentTime > cooldownDuration && isInsideHole()) {
                // Calculate the percentage of overlap between the shape and the hole
                const overlapPercentage = calculateOverlapPercentage();

                // If the overlap is greater than 90%, trigger success
                if (overlapPercentage > 90) {
                    // Increase the score and notify parent component about the score change
                    const newScore = score + 1;
                    setScore(newScore);
                    onScoreChange(newScore);

                    // Change the background color to green for 500ms
                    document.body.style.backgroundColor = '#00FF00';
                    setTimeout(() => {
                        document.body.style.backgroundColor = ''; // Reset the background color
                    },500);

                    // Handle successful placement (show response when the shape is hidden inside the hole)
                    alert(`Shape fitted! Score increased!`);

                    // Reset the game
                    resetGame();

                    // Check for level increase every 10 fits
                    increaseDifficulty();

                    // Update the last alignment time
                    lastAlignmentTime = currentTime;
                }
            }
        };

        window.addEventListener('deviceorientation', updatePosition);

        return () => {
            window.removeEventListener('deviceorientation', updatePosition);
        };
    },[loading,level,score]);

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
        setShapeStyles({
            left: '40%',
            top: '40%',
            backgroundColor: '#fff',
            zIndex: 1, // Ensure the shape is rendered above other elements
        });
        setHoleStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });

        // Remove all additional shapes
        let additionalShapes = document.querySelectorAll(`.${styles.additionalShape}`);
        additionalShapes.forEach((shape) => shape.remove());

        // Create a new shape
        createNewShape();
    };

    const increaseDifficulty = () => {
        // Create a new shape for each level increase
        createNewShape();
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
            let shapes = document.querySelectorAll(`.${styles.additionalShape}`);

            for (let shape of shapes) {
                let shapeRect = shape.getBoundingClientRect();

                // Check if the entire shape is inside the hole
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

    const calculateOverlapPercentage = () => {
        // Calculate the overlap percentage between the shape and the hole
        const holeElement = document.getElementById(styles.hole);
        const shapeElement = document.querySelector(`.${styles.shape}`);

        if (holeElement && shapeElement) {
            const holeRect = holeElement.getBoundingClientRect();
            const shapeRect = shapeElement.getBoundingClientRect();

            const overlapWidth = Math.max(0,Math.min(shapeRect.right,holeRect.right) - Math.max(shapeRect.left,holeRect.left));
            const overlapHeight = Math.max(0,Math.min(shapeRect.bottom,holeRect.bottom) - Math.max(shapeRect.top,holeRect.top));

            const overlapArea = overlapWidth * overlapHeight;
            const shapeArea = (shapeRect.right - shapeRect.left) * (shapeRect.bottom - shapeRect.top);

            const overlapPercentage = (overlapArea / shapeArea) * 100;

            return overlapPercentage;
        }

        return 0;
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