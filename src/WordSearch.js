import React, { Component } from 'react';
import './WordSearch.css';

class WordSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gridSize: 20,
      wordList: [
        'REACT', 'NODE', 'JAVA', 'CSS', 'HTML', 'JAVASCRIPT',
        'ANGULAR', 'VUE', 'REACTNATIVE', 'TYPESCRIPT', 'PYTHON',
        'RUBY', 'PHP', 'SWIFT', 'KOTLIN', 'OBJECTIVEC', 'SQL',
        'MONGODB', 'POSTGRESQL', 'MYSQL'
      ],
      selectedCells: [],
      correctWords: [] // Tracks positions of letters of correctly guessed words
    };
  }

  componentDidMount() {
    this.generateGrid();
  }

  generateGrid = () => {
    const { gridSize, wordList } = this.state;
    let grid = Array.from({ length: gridSize }, () =>
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

        if (this.canPlaceWord(grid, word, startPos, direction, gridSize)) {
          this.placeWord(grid, word, startPos, direction);
          placed = true;
        }
      }
    });

    // Fill empty cells with random letters
    grid = grid.map(row => row.map(cell => cell.letter === '' ? { ...cell, letter: this.getRandomLetter() } : cell));

    this.setState({ grid });
  };

  canPlaceWord = (grid, word, startPos, direction, gridSize) => {
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

  placeWord = (grid, word, startPos, direction) => {
    let pos = { ...startPos };
    for (let i = 0; i < word.length; i++) {
      grid[pos.x][pos.y].letter = word[i];
      pos.x += direction.x;
      pos.y += direction.y;
    }
  };

  getRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };

  // Methods for handleMouseDown, handleMouseEnter, handleMouseUp remain unchanged
  handleMouseDown = (row, col) => {
    const { grid } = this.state;
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, selected: true };
        }
        return cell;
      })
    );
    this.setState({ grid: newGrid, selectedCells: [{ row, col }] });
  };

  handleMouseEnter = (row, col) => {
    const { grid, selectedCells } = this.state;
    if (selectedCells.length > 0) {
      const newGrid = grid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, selected: true };
          }
          return cell;
        })
      );
      this.setState({ grid: newGrid, selectedCells: [...selectedCells, { row, col }] });
    }
  };

  handleMouseUp = () => {
    const { grid, selectedCells, wordList, correctWords } = this.state;
    const selectedWord = selectedCells.map(({ row, col }) => grid[row][col].letter).join('');
    if (wordList.includes(selectedWord)) {
      this.setState({ correctWords: [...correctWords, selectedCells] });
    } else {
      // Reset selection if word not found, except for correct words
      const newGrid = grid.map(row => row.map(cell => ({ ...cell, selected: false })));
      this.setState({ grid: newGrid });
    }
    this.setState({ selectedCells: [] });
  };

  render() {
    const { grid, correctWords } = this.state;
    return (
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
                  onMouseDown={() => this.handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => this.handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={this.handleMouseUp}
                >
                  {cell.letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

export default WordSearch;
