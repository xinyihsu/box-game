import React, {useEffect, useState} from 'react';
import { BoardList } from './Board.js';
import './App.css';


export default function App() {
  const [level, setLevel] = useState(0);
  const [position, setPosition] = useState(BoardList[level].initPos);
  const [board, setBoard] = useState(deepCloneArray(BoardList[level].board));
  //let theBoard = BoardList[level].board;
  const endPos = BoardList[level].endPos;
  let [x, y] = position;
  
  const handleKeyDown = (event) => {
    let [newX, newY] = position;
    switch (event.key) {
      case 'ArrowUp':
        newX--;
        //console.log('Up arrow key pressed');
        break;
      case 'ArrowDown':
        newX++;
        break;
      case 'ArrowLeft':
        newY--;
        break;
      case 'ArrowRight':
        newY++;
        break;
      default:
        break;
    }

    if (board[newX][newY] === 'B') {
      //move the box
      let deltaX = newX -x;
      let deltaY = newY -y;
      if (board[newX + deltaX][newY + deltaY] === 'O') {
        let newBoard = board.slice();
        newBoard[newX][newY] = 'O';
        newBoard[newX + deltaX][newY + deltaY] = 'B';
        setBoard(newBoard);
        setPosition([newX, newY]);
      }
    } else if (board[newX][newY] === 'O') {
      setPosition([newX, newY]);
    } 
    
    //console.log('move', BoardList[level].board);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [x, y]);

  //compute finish
  let ifFinish = true;
  endPos.map((pos) => {
    const [endPosX, endPosY] = pos;
    if (board[endPosX][endPosY] !== 'B') ifFinish = false;
  })
  if (ifFinish) {
    console.log(BoardList[level].board);
    return (
      <>
      <h1>win</h1>
      <button onClick={() => NextLevel()}>Next Level</button>
      </>
    );
  }

  function NextLevel() {
    setLevel(level + 1);
    setBoard(deepCloneArray(BoardList[level + 1].board));
    setPosition(BoardList[level + 1].initPos);
  }

  function Restart() {
    setBoard(deepCloneArray(BoardList[level].board));
    setPosition(BoardList[level].initPos);
  }

  return (
    <>
    <div className='description'>
      <h1>Level {level + 1}</h1>
      <div className='box'></div><h3>box</h3>
      <div className='person'></div><h3>person</h3>
      <div className='end'>X</div><h3>end</h3>
      <button onClick={() => Restart()}>Restart</button>
    </div>
    <div className='board'>
      {board.map((rowValue, rowIndex) => (
        <div key={`row-${rowIndex}`} className="board-row">
          {rowValue.map((colValue, colIndex) => {
            const squareIndex = rowIndex * 3 + colIndex;
            
            let name = '';
            if (colValue === 'X') name ='wall';
            else if (colValue === 'O') name = 'road';
            else if (colValue === 'B') name = 'box';
            
            endPos.map((pos) => {
              const [endPosX, endPosY] = pos;
              if (rowIndex === endPosX && colIndex === endPosY) {
                if (colValue === 'B') name = 'box-success';
                else name = 'end';
              }
            })
            
            if (rowIndex === x && colIndex === y) name = 'person';
            
            if (name === 'end') {
              return (
                <div key={`square-${squareIndex}`} className={name}>X</div>
              )
            }
            return (
              <div key={`square-${squareIndex}`} className={name}></div>
            )
          })}
        </div>
      ))}
    </div>
    </>
  );
}

function deepCloneArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}

// function Board(type) {
//   const theBoard = [
//     ['X', 'X', 'X', 'X', 'X', 'X'],
//     ['X', 'O', 'O', 'O', 'O', 'X'],
//     ['X', 'O', 'O', 'O', 'O', 'X'],
//     ['X', 'O', 'B', 'O', 'O', 'X'],
//     ['X', 'O', 'O', 'O', 'O', 'X'],
//     ['X', 'X', 'X', 'X', 'X', 'X']
//   ];

//   let personPos = [3, 2];

//   if (type === 'board') return theBoard;
//   else if (type === 'person') return personPos;
// }