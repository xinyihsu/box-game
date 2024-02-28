import React, {useEffect, useState} from 'react';
import { BoardList } from './Board.js';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faBox, faPerson } from '@fortawesome/free-solid-svg-icons'

export default function App() {
  const [inputValue, setInputValue] = useState("admin");
  const [count, setCount] = useState(0);
  const [player, setPlayer] = useState("");
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

  //? not to calculate input name time
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCount((pre) => (pre + 1));
      console.log("time");
    }, 1000);
    return () => {
      clearInterval(timer);
      console.log("clean");
    };
  }, []);

  //compute finish
  let ifFinish = true;
  endPos.map((pos) => {
    const [endPosX, endPosY] = pos;
    if (board[endPosX][endPosY] !== 'B') ifFinish = false;
  })
  if (ifFinish) {
    //finish the game
    if (level === 2) {
      setLevel(pre => pre + 1);
      console.log(level);
      SetLocalS(player, count);
      return (
        <h3>win</h3>
      );
    }
    NextLevel();
    // return (
    //   <>
    //   <h1>win</h1>
    //   <button onClick={() => NextLevel()}>Next Level</button>
    //   </>
    // );
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

  if (player === "") {
    return (
      <>
      <label>
        Input your name : 
        <input id='user-name' type='text' value={inputValue}
          onChange={e => setInputValue(e.target.value)}/>
      </label>
      <button onClick={() => {setPlayer(inputValue); setCount(0);}}>submit</button>
      </>
    );
  }

  if (level === 3) {
    return (
      <>
      <h1>rank table</h1>
      <RankTable />
      </>
    );
  }

  return (
    <>
    <div className='description'>
      <div>{count}</div>
      <h1>Level {level + 1}</h1>
      <div className='box'><FontAwesomeIcon icon={faBoxOpen} /></div><h3>box</h3>
      <div className='person'><FontAwesomeIcon icon={faPerson} /></div><h3>person</h3>
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
            else if (name === 'box-success') {
              return (
                <div key={`square-${squareIndex}`} className={name}><FontAwesomeIcon icon={faBox} /></div>
              )
            }
            else if (name === 'person') {
              return (
                <div key={`square-${squareIndex}`} className={name}><FontAwesomeIcon icon={faPerson} /></div>
              )
            }
            else if (name === 'box') {
              return (
                <div key={`square-${squareIndex}`} className={name}><FontAwesomeIcon icon={faBoxOpen} /></div>
              )
            }
            else {
              return (
                <div key={`square-${squareIndex}`} className={name}></div>
              )
            }
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

function SetLocalS(name, count) {
  let rank = JSON.parse(localStorage.getItem("rank")) || [];

  //detect if dulplicate
  let ifDulpli = false;
  rank.map((temp) => {
    if (temp.name === name && temp.time === count) {
      ifDulpli = true;
      console.log("same.");
    } else {
      console.log("different.");
    }
  })
  if (!ifDulpli) {
    let newData = {
      name: name,
      time: count
    };
    rank = [...rank, newData];
  }

  //sort the rank ? can impriment
  for (let i = 0; i < rank.length; i++) {
    for (let j = i; j < rank.length - 1; j++) {
      if (rank[j].time > rank[j + 1].time) {
        let temp = rank[j];
        rank[j] = rank[j + 1];
        rank[j + 1] = temp;
      }
    }
  }

  localStorage.setItem("rank", JSON.stringify(rank));
}

function RankTable() {
  const rank = JSON.parse(localStorage.getItem("rank")) || [];

  return (
    <>
    <ol key="ranktable">
    {rank.map((temp, index) => (
      <li id={`ranktable-${index}`}><b>{temp.name}</b> : {temp.time} sec</li>
    ))}
    </ol>
    </>
  );
}