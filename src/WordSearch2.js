import React, { useState, useEffect } from 'react';
import './WordSearch2.css'; // Your CSS file

const gridSize = 10; // Example grid size
const wordList = ['APPLE', 'BANANA', 'KIWI', 'ORANGE']; // Example word list

const WordSearch = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  useEffect(() => {
    // Initialize the grid and place words
    const newGrid = initializeGrid(gridSize, wordList);
    setGrid(newGrid);
  }, []);

  const handleMouseDown = (row, col) => {
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row, col) => {
    if (selectedCells.length > 0) {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    const word = selectedCells.map(sc => grid[sc.row][sc.col]).join('');
    if (wordList.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
    }
    setSelectedCells([]);
  };

  // Render the grid and the word list
  return (
    <div className="word-search-container">
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`grid-cell ${selectedCells.some(sc => sc.row === rowIndex && sc.col === colIndex) ? 'selected' : ''}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="word-list">
        {wordList.map(word => (
          <div key={word} className={`word ${foundWords.includes(word) ? 'found' : ''}`}>
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to initialize the grid and place words
function initializeGrid(size, words) {
  // Create an empty grid
  let grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));

  // Place words in the grid
  words.forEach(word => {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      const horizontal = Math.random() > 0.5;
      if (horizontal) {
        if (col + word.length < size) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          placed = true;
        }
      } else {
        if (row + word.length < size) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
          }
          placed = true;
        }
      }
    }
  });

  // Fill the remaining empty cells with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
}

export default WordSearch;
