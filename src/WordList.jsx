import React from 'react'
import WordSearch from './WordSearch';

const WordList = ({wordList}) => {
  return (
    <div>
      <h2>Words:</h2>
      {/* <p>{wordList}</p> */}
      <ul style={{listStyleType: "none"}}>
        {wordList?.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  )
}
export default WordList;