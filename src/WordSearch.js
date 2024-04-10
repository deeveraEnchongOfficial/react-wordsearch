import React, { useState, useEffect } from "react";
import "./WordSearch.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const WordSearch = () => {
  const gridSize = 20;
  const wordList = [
    "REACT",
    "NODE",
    "JAVA",
    "CSS",
    "HTML",
    // "JAVASCRIPT",
    // "ANGULAR",
    "VUE",
    // "REACTNATIVE",
    // "TYPESCRIPT",
    // "PYTHON",
    "RUBY",
    "PHP",
    "SWIFT",
    // "KOTLIN",
    // "OBJECTIVEC",
    "SQL",
    // "MONGODB",
    // "POSTGRESQL",
    "MYSQL",
  ];

  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [initialMove, setInitialMove] = useState({ row: null, col: null });

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    let initialGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({ letter: "", selected: false }))
    );

    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ];

    wordList.forEach((word) => {
      let placed = false;
      while (!placed) {
        const direction =
          directions[Math.floor(Math.random() * directions.length)];
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

    initialGrid = initialGrid.map((row) =>
      row.map((cell) =>
        cell.letter === "" ? { ...cell, letter: getRandomLetter() } : cell
      )
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
        grid[pos.x][pos.y].letter !== ""
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

  const isValidNextCell = (lastCell, nextCell) => {
    if (!lastCell) return true;

    const dx = nextCell.row - lastCell.row;
    const dy = nextCell.col - lastCell.col;

    if (selectedCells.length === 1) {
      setInitialMove({ row: dx, col: dy });
    }

    if (selectedCells.length > 1 && (initialMove.row !== null || initialMove.col !== null)) {
      // If the change in x-direction (dx) is not equal to the initial row, reset the initial move
      if (dx !== initialMove.row) {
        setInitialMove({ row: null, col: null });
        return false;
      }
    }

    // if (selectedCells.length > 1) {
    //   if (initialMove.row !== null || initialMove.col !== null) {
    //     if (dx != initialMove.row) {
    //       setInitialMove({ row: null, col: null });
    //       return false;
    //     }
    //   }
    // }

    // if (initialMove.row !== null || initialMove.col !== null) {
    //   if (dx != initialMove.row) {
    //     setInitialMove({ row: null, col: null });
    //     return false;
    //   }
    // }

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return false;
    if (dx === 0 && dy === 0) return false;

    if (selectedCells.length > 1) {
      const direction = {
        x: nextCell.row - selectedCells[0].row,
        y: nextCell.col - selectedCells[0].col,
      };
      const normalizedDirection = {
        x: Math.sign(direction.x),
        y: Math.sign(direction.y),
      };
      const prevDirection = {
        x: lastCell.row - selectedCells[0].row,
        y: lastCell.col - selectedCells[0].col,
      };
      const normalizedPrevDirection = {
        x: Math.sign(prevDirection.x),
        y: Math.sign(prevDirection.y),
      };

      return (
        normalizedDirection.x === normalizedPrevDirection.x &&
        normalizedDirection.y === normalizedPrevDirection.y
      );
    }

    return true;
  };

  const handleMouseDown = (row, col) => {
    const newSelectedCells = [{ row, col }];
    setSelectedCells(newSelectedCells);
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => ({
        ...cell,
        selected: rowIndex === row && colIndex === col,
      }))
    );
    setGrid(newGrid);
  };

  const handleMouseEnter = (row, col) => {
    if (selectedCells.length > 0) {
      const nextCell = { row, col };
      const lastCell = selectedCells[selectedCells.length - 1];
      if (isValidNextCell(lastCell, nextCell)) {
        const newSelectedCells = [...selectedCells, nextCell];
        setSelectedCells(newSelectedCells);
        const newGrid = grid.map((gridRow, rowIndex) =>
          gridRow.map((cell, colIndex) => ({
            ...cell,
            selected: newSelectedCells.some(
              (sc) => sc.row === rowIndex && sc.col === colIndex
            ),
          }))
        );
        setGrid(newGrid);
      }
    }
  };

  const handleTouchStart = (event, row, col) => {
    event.preventDefault(); // Prevent scrolling
    handleMouseDown(row, col);
  };

  // const handleTouchMove = (event) => {
  //   event.preventDefault(); // Prevent scrolling
  //   if (event.touches.length > 0) {
  //     const touch = event.touches[0];
  //     const target = document.elementFromPoint(touch.clientX, touch.clientY);

  //     console.log('whahhaha-touch',touch);
  //     console.log('whahhaha-target',target);
  //     if (target && target.dataset.row && target.dataset.col) {
  //       handleMouseEnter(
  //         parseInt(target.dataset.row, 10),
  //         parseInt(target.dataset.col, 10)
  //       );
  //     }
  //   }
  // };

  const handleTouchMove = (event) => {
    event.preventDefault(); // Prevent scrolling
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
  
      if (target && target.dataset.row && target.dataset.col) {
        const newRow = parseInt(target.dataset.row, 10);
        const newCol = parseInt(target.dataset.col, 10);
  
        // Assuming lastCell is the last cell in the selectedCells array
        const lastCell = selectedCells[selectedCells.length - 1];
  
        if (lastCell) {
          const dx = newRow - lastCell.row;
          const dy = newCol - lastCell.col;
  
          // If this is the first move after the initial selection
          if (selectedCells.length === 1) {
            setInitialMove({ row: dx, col: dy });
          } else {
            // Ensure that the move is consistent with the initial direction
            const isDiagonal = Math.abs(initialMove.row) === 1 && Math.abs(initialMove.col) === 1;
            const movingDiagonally = Math.abs(dx) === 1 && Math.abs(dy) === 1;
            const directionChanged = (isDiagonal && !movingDiagonally) || (!isDiagonal && movingDiagonally);
  
            // If trying to change direction (diagonal to non-diagonal or vice versa), return early
            if (directionChanged) {
              return;
            }
          }
        }
  
        handleMouseEnter(newRow, newCol);
      }
    }
  };
  

  const handleTouchEnd = () => {
    finalizeSelection();
  };

  const handleMouseUp = () => {
    finalizeSelection();
  };

  const finalizeSelection = () => {
    const selectedWord = selectedCells
      .map(({ row, col }) => grid[row][col].letter)
      .join("");
    if (wordList.includes(selectedWord)) {
      setCorrectWords([...correctWords, selectedCells]);
    } else {
      const newGrid = grid.map((row) =>
        row.map((cell) => ({ ...cell, selected: false }))
      );
      setGrid(newGrid);
    }
    setSelectedCells([]);
  };

  const [timer, setTimer] = React.useState(0);
  const [color, setColor] = React.useState("green");
  const [score, setScore] = React.useState(0);
  
  const renderTime = ({ remainingTime }) => {
    if(remainingTime<=10){
      setColor("#A30000");
    }else if(remainingTime<=30){
      setColor("#DAA520");
    }else{
      // retention
    }
    if (remainingTime === 0) {
      return <div className="font-bold text-lg animate-bounce">Times Up</div>;
    }

    return (
      <div className="timer">
        <div className="text">Remaining</div>
        <div className="value"><p className="font-bold text-xl">{remainingTime}</p></div>
        <div className="text">seconds</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row space-x-20 items-center justify-center bg-neutral-400 h-full w-full">
      <div className="space-y-14">
        <CountdownCircleTimer
          key={timer}
          isPlaying
          duration={50}
          colors={color}
          onComplete={() => [false, 1000]}
        >
          {renderTime}
        </CountdownCircleTimer>
        <div className="">
          <p className="font-semibold animate-pulse">Score: {score}/20</p>
        </div>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => {
              const isCorrectCell = correctWords
                .flat()
                .some((pos) => pos.row === rowIndex && pos.col === colIndex);
              const cellClass = isCorrectCell
                ? "cell correct"
                : cell.selected
                ? "cell selected"
                : "cell";
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
    </div>
  );
};

export default WordSearch;
