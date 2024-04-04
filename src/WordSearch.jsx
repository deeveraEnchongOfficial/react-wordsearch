import React, { useState, useEffect } from 'react';
import './WordSearch.css';
import WordList from './WordList';

const WordSearch = () => {
  const gridSize = 20;
  const wordList = [
    'REACT', 'NODE', 'JAVA', 'CSS', 'HTML', 'JAVASCRIPT',
    'ANGULAR', 'VUE', 'REACTNATIVE', 'TYPESCRIPT', 'PYTHON',
    'RUBY', 'PHP', 'SWIFT', 'KOTLIN', 'OBJECTIVEC', 'SQL',
    'MONGODB', 'POSTGRESQL', 'MYSQL',
  ];

  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);

  useEffect(() => {
    generateGrid();
    // eslint-disable-next-line
  }, []); // Equivalent to componentDidMount in class components

  const generateGrid = () => {
    let initialGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({ letter: '', selected: false }))
    );

    const directions = [
      { x: 0, y: 1 }, // Horizontal
      { x: 1, y: 0 }, // Vertical
      { x: 1, y: 1 }, // Diagonal right
      { x: 1, y: -1 }, // Diagonal left
    ];

    wordList.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startPos = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };

        if (canPlaceWord(initialGrid, word, startPos, direction)) {
          placeWord(initialGrid, word, startPos, direction);
          placed = true;
        }
      }
    });

    // Fill empty cells with random letters
    initialGrid = initialGrid.map(row => row.map(cell => cell.letter === '' ? { ...cell, letter: getRandomLetter() } : cell));

    setGrid(initialGrid);
  };

  const canPlaceWord = (grid, word, startPos, direction) => {
    let pos = { ...startPos };
    for (let i = 0; i < word.length; i++) {
      if (pos.x < 0 || pos.x >= gridSize || pos.y < 0 || pos.y >= gridSize || grid[pos.x][pos.y].letter !== '') {
        return false;
      }
      pos.x += direction.x;
      pos.y += direction.y;
    }
    return true;
  };

  const placeWord = (grid, word, startPos, direction) => {
    let pos = { ...startPos };
    for (let i = 0; i < word.length; i++) {
      grid[pos.x][pos.y].letter = word[i];
      pos.x += direction.x;
      pos.y += direction.y;
    }
  };

  const getRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };

  const handleMouseDown = (row, col) => {
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, selected: true };
        }
        return cell;
      })
    );
    setGrid(newGrid);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row, col) => {
    if (selectedCells.length > 0) {
      const newGrid = grid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, selected: true };
          }
          return cell;
        })
      );
      setGrid(newGrid);
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    const selectedWord = selectedCells.map(({ row, col }) => grid[row][col].letter).join('');
    if (wordList.includes(selectedWord)) {
      setCorrectWords([...correctWords, selectedCells, selectedWord]);
    } else {
      // Reset selection if word not found, except for correct words
      const newGrid = grid.map(row => row.map(cell => ({ ...cell, selected: false })));
      setGrid(newGrid);
    }
    setSelectedCells([]);
  };

  return (
    <><WordList wordList={wordList} correctWords={correctWords}/>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => {
              const isCorrectCell = correctWords.flat().some(pos => pos.row === rowIndex && pos.col === colIndex);
              const cellClass = isCorrectCell ? 'cell correct' : cell.selected ? 'cell selected' : 'cell';
              return (
                  <div
                    key={colIndex}
                    className={cellClass}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {cell.letter}
                  </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default WordSearch;
