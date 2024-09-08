import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

// Define the base color set (expanded for higher difficulty levels)
const baseColors = [
  '#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33FFFC', '#FFC300', '#DAF7A6', '#C70039',
  '#FF8C00', '#00FF8C', '#8C00FF', '#FF8C8C', '#8C8CFF', '#8CFF8C', '#FF8C00', '#00FF8C',
  '#8CFF8C', '#8CFF00', '#00FF8C', '#8C8C00', '#8C00FF', '#FF00C4', '#C4FF00', '#C4FF8C',
  '#FF8CFF', '#8C8CFF', '#00C4FF', '#8CFF00', '#FF8C00', '#C4FF8C', '#FF00C4', '#C4FF00'
];

// Generate cards based on difficulty level
const generateCards = (numCards) => {
  const numPairs = numCards / 2;
  const colorSet = baseColors.slice(0, numPairs); // Use unique colors for pairs

  const shuffledColors = [...colorSet, ...colorSet].sort(() => Math.random() - 0.5);
  return shuffledColors.map((color) => ({
    color,
    id: nanoid(),
    flipped: false,
  }));
};

function Game() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [columns, setColumns] = useState(4); // Default column count for easy level
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State for confirmation dialog
  const [selectedLevel, setSelectedLevel] = useState(null); // State to hold the selected level

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0 && !gameOver) {
      setGameOver(true);
      // Check if the current score is higher than the high score and update it
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [timer, gameOver, score, highScore]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.color === secondCard.color) {
        setScore((prevScore) => prevScore + 1);
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, flipped: true }
              : card
          )
        );
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 1000);
      }
      setFlippedIndices([]);
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    // Check if all cards are matched
    if (cards.every(card => card.flipped)) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [cards, score, highScore]);

  const handleCardClick = (index) => {
    if (flippedIndices.length < 2 && !cards[index].flipped && !gameOver) {
      setCards((prevCards) =>
        prevCards.map((card, idx) =>
          idx === index ? { ...card, flipped: true } : card
        )
      );
      setFlippedIndices((prevIndices) => [...prevIndices, index]);
    }
  };

  const handleLevelSelect = (selectedLevel) => {
    setSelectedLevel(selectedLevel); // Save the selected level
    setShowConfirmDialog(true); // Show the confirmation dialog
  };

  const startGame = () => {
    let numCards, columnsCount, timeLimit;
    switch (selectedLevel) {
      case 'easy':
        numCards = 40;
        columnsCount = 5;
        timeLimit = 300; 
        break;
      case 'medium':
        numCards = 100;
        columnsCount = 8;
        timeLimit = 420; 
        break;
      case 'hard':
        numCards = 200;
        columnsCount = 8;
        timeLimit = 540; 
        break;
      default:
        return;
    }
  
    setCards(generateCards(numCards));
    setScore(0);
    setTimer(timeLimit); // Set timer based on difficulty level
    setGameOver(false);
    setLevel(selectedLevel);
    setColumns(columnsCount); // Update columns state based on difficulty level
    setShowConfirmDialog(false); // Hide the confirmation dialog
  };

  const cancelGame = () => {
    setShowConfirmDialog(false); // Hide the confirmation dialog
  };

  const restartGame = () => {
    setCards([]);
    setFlippedIndices([]);
    setScore(0);
    setTimer(0);
    setGameOver(false);
    setLevel(null);
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {!level ? (
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-4">Select Difficulty Level</div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={() => handleLevelSelect('easy')}>Easy</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-2" onClick={() => handleLevelSelect('medium')}>Medium</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleLevelSelect('hard')}>Hard</button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-4">Hue Rush</div>
          <div className="text-lg mb-2">Score: {score}</div>
          <div className="text-lg mb-4">Time Left: {timer}s</div>
          {gameOver && (
            <div className="text-2xl font-bold mb-4 text-center">
              Game Over! Final Score: {score}
              <div className="text-lg mt-2">High Score: {highScore}</div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={restartGame}>Restart</button>
            </div>
          )}
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`w-16 h-16 flex items-center justify-center cursor-pointer rounded-md transition-transform transform ${card.flipped ? '' : 'rotate-y-180'}`}
                style={{ backgroundColor: card.flipped ? card.color : '#d1d5db' }} // Inline style for background color
                onClick={() => handleCardClick(index)}
              >
                {!card.flipped && <div className="text-white text-lg">?</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <div className="text-lg mb-4">Are you sure you want to start the game?</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={startGame}>Start Game</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={cancelGame}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
