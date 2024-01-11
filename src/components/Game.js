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
        zIndex: 1,
    });
    const [holeStyles, setHoleStyles] = useState({
        left: '40%',
        top: '40%',
        backgroundColor: '#fff',
    });
    const [level, setLevel] = useState(1);
    let lastAlignmentTime = 0;

    useEffect(() => {
        const sensitivity = 10;
        const cooldownDuration = 1000;

        const updatePosition = (event) => {
            let x = event.gamma;
            let y = event.beta;

            // Normalize sensor data to the desired range
            x = normalize(x, -90, 90);
            y = normalize(y, -90, 90);

            x = x / sensitivity;
            y = y / sensitivity;

            setShapeStyles((prevStyles) => {
                const newLeft = parseFloat(prevStyles.left) + x;
                const newTop = parseFloat(prevStyles.top) + y;

                const boundedLeft = Math.max(0, Math.min(100, newLeft));
                const boundedTop = Math.max(0, Math.min(100, newTop));

                console.log('Current Shape Position:', boundedLeft, boundedTop);

                return {
                    ...prevStyles,
                    left: `${boundedLeft}%`,
                    top: `${boundedTop}%`,
                };
            });

            setHoleStyles((prevStyles) => {
                const newLeft = parseFloat(prevStyles.left) + x;
                const newTop = parseFloat(prevStyles.top) + y;

                const boundedLeft = Math.max(0, Math.min(100, newLeft));
                const boundedTop = Math.max(0, Math.min(100, newTop));

                console.log('Current Hole Position:', boundedLeft, boundedTop);

                return {
                    ...prevStyles,
                    left: `${boundedLeft}%`,
                    top: `${boundedTop}%`,
                };
            });

            logBoundingRectangles();
            checkAlignment();
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

    const logBoundingRectangles = () => {
        const holeElement = document.getElementById(styles.hole);
        const shapes = document.querySelectorAll(`.${styles.additionalShape}`);

        if (holeElement) {
            const holeRect = holeElement.getBoundingClientRect();
            console.log('Hole Rectangle:', holeRect);
        }

        shapes.forEach((shape, index) => {
            const shapeRect = shape.getBoundingClientRect();
            console.log(`Shape ${index} Rectangle:`, shapeRect);
        });
    };

    const checkAlignment = () => {
        const shapeInsideHole = isInsideHole();
        console.log('Is Inside Hole:', shapeInsideHole);

        if (shapeInsideHole) {
            // Handle successful placement
            alert(`Shape fitted! Level ${level} completed!`);

            // Reset the game
            resetGame();

            // Check for level increase every 10 fits
            increaseDifficulty();
        }
    };

    const isInsideHole = () => {
        const holeElement = document.getElementById(styles.hole);

        if (holeElement) {
            const hole = holeElement.getBoundingClientRect();
            const shapes = document.querySelectorAll(`.${styles.additionalShape}`);

            for (const shape of shapes) {
                const shapeRect = shape.getBoundingClientRect();

                // Check if the shape is inside the hole
                if (
                    shapeRect.left > hole.left &&
                    shapeRect.right < hole.right &&
                    shapeRect.top > hole.top &&
                    shapeRect.bottom < hole.bottom
                ) {
                    console.log('Is Inside Hole: true');
                    return true;
                } else {
                    console.log('Is Inside Hole: false');
                }
            }
        }

        return false;
    };

    const resetGame = () => {
        setShapeStyles({
            left: '40%',
            top: '40%',
            backgroundColor: '#fff',
            zIndex: 1,
        });
        setHoleStyles({ left: '40%', top: '40%', backgroundColor: '#fff' });

        let additionalShapes = document.querySelectorAll(`.${styles.additionalShape}`);
        additionalShapes.forEach((shape) => shape.remove());

        createNewShape();
    };

    const increaseDifficulty = () => {
        createNewShape();
    };

    const createNewShape = () => {
        let newShape = document.createElement('div');
        newShape.className = styles.additionalShape;
        setElementStyles(newShape, getRandomShapePosition());
        document.getElementById(styles.gameContainer).appendChild(newShape);
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

    const normalize = (value, min, max) => {
        return Math.min(max, Math.max(min, value));
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
