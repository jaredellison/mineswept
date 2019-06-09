import React from 'react';
import Counter from './counter.jsx';
import Smile from './smile.jsx';
import Square from './square.jsx';

const INIT_STATE = {
  gameState: 'new-game', // "new-game", "playing", "winner", "game-over"
  sizeX: 9,
  sizeY: 9,
  mines: 10,
  timeCount: 0,
  flagCount: 10,
  squares: [[]],
  timerId: null,
  uncoveredCount: 0,
  losing: [null, null]
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = INIT_STATE;

    // Event Handlers
    this.startNewGame = this.startNewGame.bind(this);
    this.squareClickHandler = this.squareClickHandler.bind(this);
  }

  componentDidMount() {
    this.startNewGame();
    // Prevent right clicks
    document.oncontextmenu = e => {
      e.preventDefault();
    };
  }

  ////////////////////////////////////////
  //  Change Game State

  startNewGame() {
    // create squareState array based on sizeX and sizeY
    const squares = this.createSquares(this.state.sizeX, this.state.sizeY);
    // fill board with mines based on this.state.mines
    this.placeMines(squares, this.state.mines);
    // calculate square counts based based on mines
    this.getCounts(squares);
    this.setState(() => {
    return Object.assign(
      INIT_STATE,
      {
        gameState: 'new-game',
        squares: squares,
        flagCount: this.state.mines,
        timeCount: 0
      }
    )});
  }

  endGame(y, x) {
    this.setState(() => ({ gameState: 'game-over' }));
    this.stopTimer();

    const squares = this.copySquares(this.state.squares);

    for (let row of squares) {
      for (let square of row) {
        if (square.mine === true) square.uncovered = true;
      }
    }

    this.setState(() => ({
      squares: squares,
      losing: [y, x]
    }));
  }

  checkWinner(uncovered) {
    if (uncovered + this.state.mines === this.state.sizeX * this.state.sizeY) {
      this.stopTimer();
      this.setState(() => {
        return { gameState: 'winner' };
      });
    }
  }

  ////////////////////////////////////////
  //  Initialize game

  createSquares(sizeY, sizeX) {
    const square = {
      uncovered: false,
      flag: false,
      mine: false,
      count: null
    };

    const squares = [];

    for (let y = 0; y < sizeY; y++) {
      let row = [];
      for (let x = 0; x < sizeX; x++) {
        row.push(Object.assign({}, square));
      }
      squares.push(row);
    }

    return squares;
  }

  placeMines(squares, totalMines) {
    const yMax = squares.length;
    const xMax = squares[0].length;
    let minesPlaced = 0;

    while (minesPlaced < totalMines) {
      let x = Math.floor(Math.random() * yMax);
      let y = Math.floor(Math.random() * xMax);
      if (!squares[y][x].mine) {
        squares[y][x].mine = true;
        ++minesPlaced;
      }
    }

    return squares;
  }

  getCounts(squares) {
    const yMax = squares.length;
    const xMax = squares[0].length;

    for (let y = 0; y < yMax; y++) {
      for (let x = 0; x < xMax; x++) {
        let square = squares[y][x];
        let count = 0;
        if (square.mine) continue;

        let neighbors = this.getNeighbors(y, x, yMax, xMax);
        for (let pair of neighbors) {
          if (squares[pair[0]][pair[1]].mine) count++;
        }
        square.count = count;
      }
    }

    return squares;
  }

  ////////////////////////////////////////
  //  Square Manipulation

  uncoverSquare(y, x) {
    const newSquares = this.copySquares(this.state.squares);
    let uncoveredCount = this.state.uncoveredCount + 1;

    this.checkWinner(uncoveredCount);

    newSquares[y][x].uncovered = true;
    this.setState(() => ({
      squares: newSquares,
      uncoveredCount: uncoveredCount
    }));
  }

  toggleFlag(y, x) {
    // Prevent flagging previously uncovered squares
    if (this.state.squares[y][x].uncovered) return;

    const newSquares = this.copySquares(this.state.squares);
    let flag = newSquares[y][x].flag;
    let flagCount = this.state.flagCount;

    if (!flag) {
      // Toggle On
      newSquares[y][x].flag = true;
      flagCount--;
    } else if (flag) {
      // Toggle Off
      newSquares[y][x].flag = false;
      flagCount++;
    } else {
      return;
    }

    this.setState(() => ({
      squares: newSquares,
      flagCount: flagCount
    }));
  }

  ////////////////////////////////////////
  //  Square Helpers

  uncoverNeighbors(y, x, yMax, xMax) {
    const newSquares = this.copySquares(this.state.squares);
    let uncoveredCount = this.state.uncoveredCount;

    // Recursively search and transform neighbors
    const searchNeighbors = (y, x) => {
      // Base cases
      if (y < 0 || y >= yMax) return;
      if (x < 0 || x >= xMax) return;
      if (newSquares[y][x].uncovered || newSquares[y][x].flag) return;

      newSquares[y][x].uncovered = true;
      uncoveredCount++;
      this.checkWinner(uncoveredCount);

      // Recursive cases
      if (newSquares[y][x].count === 0) {
        y > 0 && searchNeighbors(y - 1, x);
        y < yMax - 1 && searchNeighbors(y + 1, x);
        x > 0 && searchNeighbors(y, x - 1);
        x < xMax - 1 && searchNeighbors(y, x + 1);
      }
    };

    searchNeighbors(y, x);

    this.setState(() => ({
      squares: newSquares,
      uncoveredCount: uncoveredCount
    }));
  }

  getNeighbors(y, x, yMax, xMax) {
    const startY = Math.max(0, y - 1);
    const startX = Math.max(0, x - 1);
    const endY = Math.min(yMax - 1, y + 1);
    const endX = Math.min(xMax - 1, x + 1);
    const result = [];

    for (let yI = startY; yI <= endY; yI++) {
      for (let xI = startX; xI <= endX; xI++) {
        if (!(yI === y && xI === x)) {
          result.push([yI, xI]);
        }
      }
    }

    return result;
  }

  copySquares(squares) {
    const newSquares = [];
    for (let row of squares) {
      let newRow = [];
      for (let square of row) {
        let newSquare = Object.assign({}, square);
        newRow.push(newSquare);
      }
      newSquares.push(newRow);
    }
    return newSquares;
  }

  ////////////////////////////////////////
  //  Timers

  startTimer() {
    // Increment game timer each second
    if (this.state.timerId !== null || this.state.gameState !== 'playing') {
      return;
    }

    let id = setInterval(() => {
      const time = this.state.timeCount;
      if (time < 999) {
        this.setState(() => ({ timeCount: time + 1 }));
      }
    }, 1000);

    // Save id of timer
    this.setState(() => ({ timerId: id }));
  }

  stopTimer() {
    clearInterval(this.state.timerId);
    this.setState(() => ({ timerId: null }));
  }

  ////////////////////////////////////////
  //  Event Handlers

  squareClickHandler(e, y, x) {
    const square = this.state.squares[y][x];

    // Disable clicks
    if (['game-over', 'winner'].includes(this.state.gameState)) {
      return;
    }

    // Left Click
    if (e.button === 0) {
      // disable clicks
      if (square.flag) {
        return;
      }

      // if square is a mine, game over
      // due to race condition this check must happen before starting timer
      if (square.mine) {
        this.endGame(y, x);
        return;
      }

      // if square is uncovered return
      if (square.uncovered) return;

      // if square.count is over 1, uncover it
      if (square.count > 0) {
        this.uncoverSquare(y, x);
      }

      // if square is 0, uncover neighbors
      if (square.count === 0) {
        this.uncoverNeighbors(y, x, this.state.sizeY, this.state.sizeX);
      }
    }

    // Right Click
    if (e.button === 2) {
      this.toggleFlag(y, x);
    }

    // If the clock has not started, start it
    if (this.state.gameState === 'new-game') {
      this.setState(
        state => {
          return state.gameState === 'new-game' ? { gameState: 'playing' } : {};
        },
        () => {
          this.startTimer();
        }
      );
    }
  }

  render() {
    return (
      <div className="board">
        <div className="header">
          <div className="left-counter">
            <Counter count={this.state.flagCount} />
          </div>
          <Smile
            gameOver={this.state.gameState === 'game-over'}
            winner={this.state.gameState === 'winner'}
            clickHandler={this.startNewGame}
          />
          <div className="left-counter">
            <Counter count={this.state.timeCount} />
          </div>
        </div>

        <table>
          <tbody className="square-container">
            {this.state.squares.map((row, y) => {
              return (
                <tr className="square-row">
                  {row.map((squareData, x) => (
                    <Square
                      key={`${x},${y}`}
                      clickHandler={e => {
                        this.squareClickHandler(e, y, x);
                      }}
                      gameState={this.state.gameState}
                      uncovered={squareData.uncovered}
                      flag={squareData.flag}
                      count={squareData.count}
                      mine={squareData.mine}
                      losing={
                        this.state.losing[0] === y && this.state.losing[1] === x
                      }
                    />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Board;
