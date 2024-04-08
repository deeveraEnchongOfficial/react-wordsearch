import React, { useState, useEffect } from 'react';
import WordSearch from "./WordSearch";
import "./WordList.css";

const WordList = ({ wordList, correctWords }) => {
  const [completedWords, setCompletedWords] = useState([]);

  useEffect(() => {
    console.log("Correct Words:", correctWords);
    // Extract the words from correctWords
    const completed = correctWords.flatMap((item) => {
      if (Array.isArray(item)) {
        // Extract the words from the array of objects
        return item.map((obj) => obj.word);
      } else {
        // If it's a string, it's a single word
        return item;
      }
    });
    setCompletedWords(completed);
  }, [correctWords]);

  return (
    <div className='container'>
      <ul className='list'>
        {wordList.map((word, index) => {
          const isCompleted = completedWords?.includes(word);
          // console.log(word, isCompleted);
          // console.log('Status',correctWords);
          return (
            <li
              key={index}
              className = {isCompleted ? "completed" : ""}
            >
              {word}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default WordList;