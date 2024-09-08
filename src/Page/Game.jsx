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
  const [username, setUsername] = useState(''); 
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);

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
    setUsername('');
    setIsUsernameSubmitted(false);
  };

  const handleSubmitUsername = () => {
    if (username.trim()) {
      setIsUsernameSubmitted(true); // Mark the username as submitted
    }
  };

  return (
    <div className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 p-10 md:p-20">
      {!level ? (
        <div>
          <div>
            <h1 className='text-center text-4xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900'>Hue Rush</h1>
            {!isUsernameSubmitted ? (
              <div className="text-center mt-20">
                <input
                  className="p-2 border rounded-xl border-gray-300 text-lg"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  className="bg-gradient-to-bl from-purple-200 via-purple-400 to-purple-800 text-black font-semibold px-8 py-2 rounded-lg ml-4"
                  onClick={handleSubmitUsername}
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="text-center mt-20 p-1 text-3xl font-bold">
                Welcome, {username}!
              </div>
            )}
            <div className=" text-2xl md:text-4xl font-bold text-center mt-20">Select Difficulty Level</div>
          </div>
        <div className="flex gap-10 items-center justify-center mt-10"> 
          <button className="bg-gradient-to-bl from-purple-200 via-purple-400 to-purple-800 text-black font-semibold px-8 py-4 rounded " onClick={() => handleLevelSelect('easy')}  disabled={!isUsernameSubmitted}>Easy</button>
          <button className="bg-gradient-to-bl from-purple-200 via-purple-400 to-purple-800 text-black font-semibold px-8 py-4 rounded " onClick={() => handleLevelSelect('medium')} disabled={!isUsernameSubmitted}>Medium</button>
          <button className="bg-gradient-to-bl from-purple-200 via-purple-400 to-purple-800 text-black font-semibold px-8 py-4 rounded" onClick={() => handleLevelSelect('hard')} disabled={!isUsernameSubmitted}>Hard</button>
        </div>
        <div>
          <h1 className='text-4xl mt-16 text-center font-semibold text-black'>Enjoy the Game! </h1>
        </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-center text-4xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900">Hue Rush</div>
          <div className="text-4xl font-semibold mt-4">Score: {score}</div>
          <div className="text-xl font-semibold mt-4">Time Left: {timer}s</div>
          {gameOver && (
            <div className="text-2xl font-bold mt-4 text-center">
             {username}, Game Over! Final Score: {score}
              <div className="text-2xl mt-2">{username}, Your High Score: {highScore}</div>
              <button className="bg-gradient-to-bl from-purple-200 via-purple-400 to-purple-800 text-black font-semibold px-4 py-2 rounded my-6" onClick={restartGame}>Restart</button>
            </div>
          )}
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`w-16 h-16 flex items-center justify-center mt-4 cursor-pointer rounded-md transition-transform transform ${card.flipped ? '' : 'rotate-y-180'}`}
                style={{ backgroundColor: card.flipped ? card.color : 'white' }} // Inline style for background color
                onClick={() => handleCardClick(index)}
              >
                {!card.flipped && <div className="text-black text-lg">?</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <div className="text-lg mb-4">Are you sure you want to start the game?</div>
            <button className="bg-gradient-to-tr from-violet-300 to-violet-400 text-black font-semibold px-4 py-2 rounded mr-4" onClick={startGame}>Start Game</button>
            <button className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-red-500 to-red-600 text-white px-4 py-2 rounded  " onClick={cancelGame}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
