import React from 'react';
import './App.css';
import WordSearch from './WordSearch';
import WordList from './WordList';

function App() {

  const wordList = [
    'REACT', 'NODE', 'JAVA', 'CSS', 'HTML', 'JAVASCRIPT',
    'ANGULAR', 'VUE', 'REACTNATIVE', 'TYPESCRIPT', 'PYTHON',
    'RUBY', 'PHP', 'SWIFT', 'KOTLIN', 'OBJECTIVEC', 'SQL',
    'MONGODB', 'POSTGRESQL', 'MYSQL',
  ];
  
  return (<div className="App">
     
     {/* <WordList /> */}
      <WordSearch />
    </div>
  );
}

export default App;
