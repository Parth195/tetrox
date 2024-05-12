import React,{ useState,useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/game.module.css';

const Game = ({ onScoreChange }) => {
    const [loading,setLoading] = useState(true);
    const [score,setScore] = useState(0);
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

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        },1500);

        return () => {
            clearTimeout(loadingTimeout);
        };
    },[]);

    useEffect(() => {
        const sensitivity = 10;
        const cooldownDuration = 1000;

        let lastAlignmentTime = 0;

        const updatePosition = (event) => {
            const x = event.gamma / sensitivity;
            const y = event.beta / sensitivity;

            setShapeStyles(prevStyles => {
                const newLeft = parseFloat(prevStyles.left) + x;
                const newTop = parseFloat(prevStyles.top) + y;

                return {
                    ...prevStyles,
                    left: `${Math.max(0,Math.min(100,newLeft))}%`,
                    top: `${Math.max(0,Math.min(100,newTop))}%`,
                };
            });

            const currentTime = Date.now();
            if (currentTime - lastAlignmentTime > cooldownDuration && isInsideHole()) {
                const overlapPercentage = calculateOverlapPercentage();
                if (overlapPercentage > 20) {
                    const newScore = score + 1;
                    setScore(newScore);
                    onScoreChange(newScore);

                    document.body.style.backgroundColor = '#00FF00';
                    setTimeout(() => {
                        document.body.style.backgroundColor = '';
                    },500);

                    resetGame();
                    lastAlignmentTime = currentTime;
                }
            }
        };

        window.addEventListener('deviceorientation',updatePosition);

        return () => {
            window.removeEventListener('deviceorientation',updatePosition);
        };
    },[score,onScoreChange]);

    const resetGame = () => {
        setShapeStyles({
            left: '40%',
            top: '40%',
            backgroundColor: '#fff',
            zIndex: 1,
        });
        createNewShape();
    };

    const createNewShape = () => {
        const randomX = Math.floor(Math.random() * (window.innerWidth - 50));
        const randomY = Math.floor(Math.random() * (window.innerHeight - 50));
        setShapeStyles({
            ...shapeStyles,
            left: `${randomX}px`,
            top: `${randomY}px`,
        });
    };

    const isInsideHole = () => {
        const holeElement = document.getElementById(styles.hole);
        if (!holeElement) return false;

        const holeRect = holeElement.getBoundingClientRect();
        const shapeRect = document.querySelector(`.${styles.shape}`).getBoundingClientRect();

        return (
            shapeRect.left >= holeRect.left &&
            shapeRect.right <= holeRect.right &&
            shapeRect.top >= holeRect.top &&
            shapeRect.bottom <= holeRect.bottom
        );
    };

    const calculateOverlapPercentage = () => {
        const holeElement = document.getElementById(styles.hole);
        const shapeElement = document.querySelector(`.${styles.shape}`);

        if (!holeElement || !shapeElement) return 0;

        const holeRect = holeElement.getBoundingClientRect();
        const shapeRect = shapeElement.getBoundingClientRect();

        const overlapWidth = Math.max(0,Math.min(shapeRect.right,holeRect.right) - Math.max(shapeRect.left,holeRect.left));
        const overlapHeight = Math.max(0,Math.min(shapeRect.bottom,holeRect.bottom) - Math.max(shapeRect.top,holeRect.top));

        const overlapArea = overlapWidth * overlapHeight;
        const shapeArea = (shapeRect.right - shapeRect.left) * (shapeRect.bottom - shapeRect.top);

        return (overlapArea / shapeArea) * 100;
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
                    <div className={styles.hole} id={styles.hole}></div>
                </>
            )}
        </div>
    );
};

export default Game;
