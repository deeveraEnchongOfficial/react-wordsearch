import React, { useState, useEffect } from 'react';
import './WordSearch.css';

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
  }, []);

  const generateGrid = () => {
    let initialGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({ letter: '', selected: false }))
    );

    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
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

    initialGrid = initialGrid.map(row =>
      row.map(cell => (cell.letter === '' ? { ...cell, letter: getRandomLetter() } : cell))
    );

    setGrid(initialGrid);
  };

  const canPlaceWord = (grid, word, startPos, direction) => {
    let pos = { ...startPos };
    for (let i = 0; i < word.length; i++) {
      if (
        pos.x < 0 ||
        pos.x >= gridSize ||
        pos.y < 0 ||
        pos.y >= gridSize ||
        grid[pos.x][pos.y].letter !== ''
      ) {
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

  const handleTouchStart = (event, row, col) => {
    event.preventDefault(); // Prevent scrolling
    handleSelectionChange(row, col);
  };

  const handleTouchMove = (event) => {
    event.preventDefault(); // Prevent scrolling
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.dataset.row && target.dataset.col) {
        handleSelectionChange(parseInt(target.dataset.row, 10), parseInt(target.dataset.col, 10));
      }
    }
  };

  const handleTouchEnd = () => {
    finalizeSelection();
  };

  const handleMouseDown = (row, col) => {
    handleSelectionChange(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (selectedCells.length > 0) {
      handleSelectionChange(row, col);
    }
  };

  const handleMouseUp = () => {
    finalizeSelection();
  };

  const handleSelectionChange = (row, col) => {
    const newSelectedCells = [...selectedCells, { row, col }];
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => ({
        ...cell,
        selected: newSelectedCells.some(sc => sc.row === rowIndex && sc.col === colIndex),
      }))
    );
    setGrid(newGrid);
    setSelectedCells(newSelectedCells);
  };

  const finalizeSelection = () => {
    const selectedWord = selectedCells.map(({ row, col }) => grid[row][col].letter).join('');
    if (wordList.includes(selectedWord)) {
      setCorrectWords([...correctWords, selectedCells]);
      setScore(score+5);
    } else {
      const newGrid = grid.map(row =>
        row.map(cell => ({ ...cell, selected: false }))
      );
      setGrid(newGrid);
    }
    setSelectedCells([]);
  };

  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(5);
  
useEffect(()=>{
  setTimeout(()=>{
    if(seconds===0){
      setSeconds(59);
      setMinutes(minutes-1);
    }else{
      setSeconds(seconds-1);
    }
  }, 1000);
}, [seconds])

  return (
    <>
      <div className='scoreBoard'>
        <h3>Time Limit: {minutes}:{seconds < 10 ? "0"+seconds : seconds}</h3>
        <h3>Score: {score}pts</h3>
      </div>
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
                  onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  data-row={rowIndex}
                  data-col={colIndex}
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
