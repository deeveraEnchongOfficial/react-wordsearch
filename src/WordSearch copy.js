import React, { useState, useEffect } from 'react';
import './WordSearch.css';

const WordSearch = () => {
  const gridSize = 20;
  const wordList = [
    'REACT', 'NODE', 'JAVA', 'CSS', 'HTML', 'JAVASCRIPT',
    'ANGULAR', 'VUE', 'REACTNATIVE', 'TYPESCRIPT', 'PYTHON',
    'RUBY', 'PHP', 'SWIFT', 'KOTLIN', 'OBJECTIVEC', 'SQL',
    'MONGODB', 'POSTGRESQL', 'MYSQL',
  ].map(word => word.toUpperCase()); // Ensure all words are uppercase for comparison

  const [grid, setGrid] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [lines, setLines] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    let initialGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({ letter: getRandomLetter(), selected: false }))
    );
    setGrid(initialGrid);
  };

  const getRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };

  const handleMouseDown = (row, col) => {
    setStartPoint({ row, col });
    setEndPoint(null); // Reset end point on new selection
  };

  const handleMouseEnter = (row, col) => {
    if (startPoint) {
      setEndPoint({ row, col });
    }
  };

  const handleMouseUp = () => {
    if (startPoint && endPoint) {
      finalizeSelection();
      setStartPoint(null);
      setEndPoint(null);
    }
  };

  useEffect(() => {
    highlightCells();
  }, [lines, startPoint, endPoint]); // Highlight cells as the selection changes

  const highlightCells = () => {
    if (!startPoint || !endPoint) return; // Only highlight if we have a valid selection

    const tempLines = [...lines, { start: startPoint, end: endPoint }]; // Include the current selection for highlighting
    const allSelectedCells = tempLines.flatMap(line => calculateLineCells(line.start, line.end));
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        selected: allSelectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex),
      }))
    );
    setGrid(newGrid);
  };

  const finalizeSelection = () => {
    if (!startPoint || !endPoint) return;

    const selectedCells = calculateLineCells(startPoint, endPoint);
    const selectedWord = selectedCells.map(({ row, col }) => grid[row][col].letter).join('');

    if (wordList.includes(selectedWord)) {
      setCorrectWords(prevWords => [...prevWords, selectedWord]);
      setLines(prevLines => [...prevLines, { start: startPoint, end: endPoint }]);
    } else {
      // Reset selection if the word is not correct
      const newLines = lines.slice(); // Clone to trigger useEffect
      setLines(newLines);
    }
  };

  const calculateLineCells = (start, end) => {
    const cells = [];
    let x1 = start.col;
    let y1 = start.row;
    let x2 = end.col;
    let y2 = end.row;

    let dx = Math.abs(x2 - x1);
    let dy = -Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx + dy;
    let e2;

    while (true) {
      cells.push({ row: y1, col: x1 });
      if (x1 === x2 && y1 === y2) break;
      e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x1 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y1 += sy;
      }
    }

    return cells;
  };

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => {
            const cellClass = cell.selected ? 'cell selected' : 'cell';
            return (
              <div
                key={colIndex}
                className={cellClass}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
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
  );
};

export default WordSearch;
