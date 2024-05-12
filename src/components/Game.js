import React,{ useState,useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/game.module.css';

const Game = ({ onScoreChange }) => {
    const [loading,setLoading] = useState(true);
    const [shapeStyles,setShapeStyles] = useState({
        left: '40%',
        top: '40%',
        backgroundColor: '#fff',
        zIndex: 1,
    });
    const [holeStyles,setHoleStyles] = useState({
        left: '40%',
        top: '40%',
        backgroundColor: '#fff',
    });
    const [score,setScore] = useState(0);

    useEffect(() => {
        const sensitivity = 10;
        const cooldownDuration = 1000;

        let lastAlignmentTime = 0;

        const updatePosition = (event) => {
            let x = event.gamma;
            let y = event.beta;

            x = x / sensitivity;
            y = y / sensitivity;

            const newLeft = parseFloat(shapeStyles.left) + x;
            const newTop = parseFloat(shapeStyles.top) + y;

            const boundedLeft = Math.max(0,Math.min(100,newLeft));
            const boundedTop = Math.max(0,Math.min(100,newTop));

            setShapeStyles({
                ...shapeStyles,
                left: `${boundedLeft}%`,
                top: `${boundedTop}%`,
            });

            const currentTime = Date.now();
            if (currentTime - lastAlignmentTime > cooldownDuration && isInsideHole()) {
                const overlapPercentage = calculateOverlapPercentage();
                if (overlapPercentage > 90) {
                    const newScore = score + 1;
                    setScore(newScore);
                    onScoreChange(newScore);

                    // Change background color to green
                    document.body.style.backgroundColor = '#00FF00';
                    setTimeout(() => {
                        document.body.style.backgroundColor = '';
                    },500);

                    // Reset game
                    resetGame();
                    lastAlignmentTime = currentTime;
                }
            }
        };

        window.addEventListener('deviceorientation',updatePosition);

        return () => {
            window.removeEventListener('deviceorientation',updatePosition);
        };
    },[shapeStyles,score,onScoreChange]);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        },1500);

        return () => {
            clearTimeout(loadingTimeout);
        };
    },[]);

    const resetGame = () => {
        setShapeStyles({
            left: '40%',
            top: '40%',
            backgroundColor: '#fff',
            zIndex: 1,
        });
        setHoleStyles({ left: '40%',top: '40%',backgroundColor: '#fff' });
        createNewShape();
    };

    const createNewShape = () => {
        let newShape = document.createElement('div');
        newShape.className = styles.additionalShape;
        setElementStyles(newShape,getRandomShapePosition());
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

    const setElementStyles = (element,styles) => {
        Object.entries(styles).forEach(([property,value]) => {
            element.style[property] = value;
        });
    };

    const getRandomShapePosition = () => {
        let randomX = Math.floor(Math.random() * (window.innerWidth - 50));
        let randomY = Math.floor(Math.random() * (window.innerHeight - 50));
        return { left: `${randomX}px`,top: `${randomY}px`,backgroundColor: '#fff' };
    };

    const calculateOverlapPercentage = () => {
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
        <div className={styles.gameContainer} id={styles.gameContainer}>
            {loading ? (
                <div className={styles.loaderContainer}>
                    <BeatLoader color="#3498db" size={20} margin={5} />
                </div>
            ) : (
                <>
                    <div className={styles.shape} style={shapeStyles}></div>
                    <div className={styles.hole} id={styles.hole} style={holeStyles}></div>
                </>
            )}
        </div>
    );
};

export default Game;
