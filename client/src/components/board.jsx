import React from 'react';
import Counter from './counter.jsx';
import Smile from './smile.jsx';
import Square from './square.jsx';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: 'new-game', // "new-game", "playing", "winner", "game-over"
      sizeX: 9,
      sizeY: 9,
      mines: 10,
      timeCount: 0,
      flagCount: 10,
      squares: [[]],
      timerId: null,
    };

    this.startNewGame = this.startNewGame.bind(this);
    this.squareClickHandler = this.squareClickHandler.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  componentDidMount() {
    this.startNewGame();
  }

  startNewGame() {
    // create squareState array based on sizeX and sizeY
    const squares = this.createSquares(this.state.sizeX, this.state.sizeY);
    // fill board with mines based on this.state.mines
    this.placeMines(squares, this.state.mines);
    // calculate square counts based based on mines
    this.getCounts(squares);
    this.setState(() => ({
      gameState: 'new-game',
      squares: squares,
      flagCount: this.state.mines,
      timeCount: 0
    }));
  }

  startTimer() {
    // Increment game timer each second
    if (this.state.timerId !== null) return;

    let id = setInterval(() => {
      const time = this.state.timeCount;
      if (time < 999) {
        this.setState(() => ({ timeCount: time + 1 }));
      }
    }, 1000);
    this.setState(() => ({ timerId: id }));
  }

  stopTimer() {
    clearInterval(this.state.timerId);
    this.setState(() => ({ timerId: null }));
  }

  // Create a two dimensional array of squares
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

  endGame() {
    this.setState(() => ({gameState: "game-over"}));
    this.stopTimer();

    const squares = this.copySquares(this.state.squares);

    for (let row of squares) {
      for (let square of row) {
        if (square.mine === true) square.uncovered = true;
      }
    }

    this.setState(() => ({squares: squares}));
  }

  copySquares(squares) {
    const newSquares = [];
    for (let row of squares) {
      let newRow = [];
      for (let square of row) {
        let newSquare = Object.assign({}, square);
        newRow.push(newSquare);
      }
      newSquares.push(newRow)
    }
    return newSquares;
  }

  uncoverSquare(y, x) {
    const newSquares = this.copySquares(this.state.squares);
    newSquares[y][x].uncovered = true;
    this.setState(() => ({squares: newSquares}));
  }

  uncoverNeighbors(y, x, yMax, xMax) {
    const newSquares = this.copySquares(this.state.squares);

    // Recursively search and transform neighbors
    const searchNeighbors = (y, x) => {
      // Base cases
      if (y < 0 || y >= yMax) return;
      if (x < 0 || x >= xMax) return;
      if (newSquares[y][x].uncovered === true) return;

      newSquares[y][x].uncovered = true;

      // Recursive cases
      if (newSquares[y][x].count === 0) {
        y > 0 && searchNeighbors(y - 1, x);
        y < yMax - 1 && searchNeighbors(y + 1, x);
        x > 0 && searchNeighbors(y, x - 1);
        x < xMax - 1 && searchNeighbors(y, x + 1);
      }
    }

    searchNeighbors(y, x);

    this.setState(() => ({squares: newSquares}));
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

  squareClickHandler(e, y, x) {
    const square = this.state.squares[y][x];

    // if this is the clock has not started, start it
    if (this.state.gameState === "game-over") {
      return;
    }

    // if square is a mine, game over
    // due to race condition this check must happen before starting timer
    if (square.mine) {
      this.endGame();
      return;
    }

    // if this is the clock has not started, start it
    if (this.state.gameState === "new-game") {
      this.setState(() => ({gameState: "playing"}));
      this.startTimer();
    }

    // if square is uncovered return
    if (square.uncovered) return;

    // if square.count is over 1, uncover it
    if (square.count > 0) {
      this.uncoverSquare(y,x);
      return;
    }

    // if square is 0, uncover neighbors
    if (square.count === 0) {
      this.uncoverNeighbors(y, x, this.state.sizeY, this.state.sizeX);
      return;
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
            clickHandler={this.startNewGame}
          />
          <div className="left-counter">
            <Counter count={this.state.timeCount} />
          </div>
        </div>
        <div className="square-container">
          {this.state.squares.map((row, y) => {
            return (
              <div className="square-row">
                {row.map((squareData, x) => (
                  <Square
                    key={`${x},${y}`}
                    gameState={this.state.gameState}
                    clickHandler={e => {
                      e.preventDefault();
                      this.squareClickHandler(e, y, x);
                    }}
                    {...squareData}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Board;
