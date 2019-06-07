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
      squares: [[]]
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
      squares: squares,
      flagCount: this.state.mines,
      timeCount: 0
    }));
  }

  startTimer() {
    // Increment game timer each second
    setInterval(() => {
      const time = this.state.timeCount;
      if (time < 999) {
        this.setState(() => ({ timeCount: time + 1 }));
      }
    }, 1000);
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
        // Previous Row
        if (squares[y - 1]) {
          squares[y - 1][x - 1] && squares[y - 1][x - 1].mine && count++;
          squares[y - 1][x] && squares[y - 1][x].mine && count++;
          squares[y - 1][x + 1] && squares[y - 1][x + 1].mine && count++;
        }
        // Current Row
        squares[y][x - 1] && squares[y][x - 1].mine && count++;
        squares[y][x + 1] && squares[y][x + 1].mine && count++;
        // Next Row
        if (squares[y + 1]) {
          squares[y + 1][x - 1] && squares[y + 1][x - 1].mine && count++;
          squares[y + 1][x - 1] && squares[y + 1][x].mine && count++;
          squares[y + 1][x + 1] && squares[y + 1][x + 1].mine && count++;
        }
        square.count = count;
      }
    }

    return squares;
  }

  endGame() {
    console.log('game over');
  }

  copySquares() {
    const newSquares = [];
    for (let row of this.state.squares) {
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
    const newSquares = copySquares();
    newSquares[y][x].uncovered = true;
    this.setState(() => ({squares: newSquares}));
  }

  uncoverNeighbors() {
  }

  squareClickHandler(e, y, x) {
    console.log('e.button:', e.button);
    console.log('x:', x, 'y:', y);
    const square = this.state.squares[y][x];
    console.log('this.state.squares[y][x]:', this.state.squares[y][x]);
    // if this is the clock has not started, start it

    // if square is uncovered return
    if (square.uncovered) return;

    // if square is a mine, game over
    if (square.mine) {
      this.endGame();
      return;
    }

    // if square.count is over 1, uncover it
    if (square.count > 0) {
      this.uncoverSquare(y,x);
      return;
    }
    // if square is 0, uncover neighbors
    if (square.count === 0) {
      this.uncoverNeighbors(y,x);
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
