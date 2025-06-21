import React, { useState, useEffect } from 'react';
import './PuzzleGame.css';

const puzzles = [
  { folder: 'puzzle1', letter: 'S', pieces: 16 },
  { folder: 'puzzle2', letter: 'A', pieces: 16 },
  { folder: 'puzzle3', letter: 'T', pieces: 16 },
  { folder: 'puzzle4', letter: 'Y', pieces: 25 },
  { folder: 'puzzle5', letter: 'R', pieces: 36 },
];

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const PuzzleGame = () => {
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const gridSize = Math.sqrt(puzzles[currentPuzzle].pieces);
  const isTouch = isTouchDevice();

  useEffect(() => {
    if (started && !gameOver) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started, gameOver, startTime]);

  useEffect(() => {
    if (started) {
      loadPuzzle(currentPuzzle);
    }
  }, [currentPuzzle, started]);

  const loadPuzzle = (index) => {
    const count = puzzles[index].pieces;
    const shuffled = Array.from({ length: count }, (_, i) => `${i + 1}.png`).sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setCompleted(false);
    setShowLetter(false);
    setSelectedIndex(null);
  };

  const startGame = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleDrop = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updated = [...pieces];
    [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];
    setPieces(updated);
    checkCompletion(updated);
  };

  const checkCompletion = (arr) => {
    const expected = Array.from({ length: arr.length }, (_, i) => `${i + 1}.png`);
    const isCorrect = expected.every((val, idx) => arr[idx] === val);

    if (isCorrect && !completed) {
      if (!collectedLetters.includes(puzzles[currentPuzzle].letter)) {
        setCollectedLetters([...collectedLetters, puzzles[currentPuzzle].letter]);
      }
      setCompleted(true);
      setShowLetter(true);
    } else {
      setCompleted(false);
      setShowLetter(false);
    }
  };

  const handleTouchSwap = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      handleDrop(selectedIndex, index);
      setSelectedIndex(null);
    }
  };

  const handleNext = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
    } else {
      setGameOver(true);
    }
  };

  return (
    <div className="puzzle-container">
      <h1>Jigsaw Puzzle</h1>

      {!started && (
        <button className="start-button" onClick={startGame}>Start</button>
      )}

      {started && !gameOver && (
        <>
          <p>Timer: {elapsedTime}s</p>
          {isTouch && (
            <p style={{ fontSize: '14px', color: '#555' }}>
              Tap one piece, then tap another to swap them.
            </p>
          )}
          <div className="grid-wrapper">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, min(80px, 15vw))`,
                gridTemplateRows: `repeat(${gridSize}, min(80px, 15vw))`,
              }}
            >
              {pieces.map((src, index) => (
                <div
                  key={index}
                  className={`piece ${selectedIndex === index ? 'selected' : ''}`}
                  {...(!isTouch
                    ? {
                        draggable: true,
                        onDragStart: (e) => e.dataTransfer.setData('index', index),
                        onDragOver: (e) => e.preventDefault(),
                        onDrop: (e) => {
                          const from = parseInt(e.dataTransfer.getData('index'));
                          handleDrop(from, index);
                        },
                      }
                    : {
                        onClick: () => handleTouchSwap(index),
                      })}
                >
                  <img
                  src={`/images/${puzzles[currentPuzzle].folder}/${src}`}
                  alt=""
                  draggable={false}
                  className={selectedIndex === index ? 'selected' : ''}
                  />

                 
                </div>
              ))}
            </div>
          </div>

          {showLetter && (
            <div className="letter-message">
              ✅ Puzzle Complete! Letter: <strong>{puzzles[currentPuzzle].letter}</strong>
            </div>
          )}
          {completed && (
            <button className="next-button" onClick={handleNext}>
              {currentPuzzle === puzzles.length - 1 ? 'Finish' : 'Next Puzzle'}
            </button>
          )}
        </>
      )}

      {gameOver && (
        <div className="end-message">
          🎉 All puzzles completed! <br />
          Total Time: <strong>{elapsedTime}s</strong> <br />
          Final Word: <strong>{collectedLetters.join('')}</strong>
        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
