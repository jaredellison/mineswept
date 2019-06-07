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
      flagCount: 0,
      squares: null,
    };
    this.startNewGame = this.startNewGame.bind(this);
  }

  componentDidMount() {
    this.startNewGame();
  }

  startNewGame() {
    console.log('Starting new game');
    // Clear game state
    // create squareState array based on sizeX and sizeY
    const squares = this.createSquares(this.state.sizeX, this.state.sizeY);
    console.log('squares:', squares);
    // fill board with mines based on this.state.mines

    // calculate square counts based based on mines
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
          <Square status="covered" count="1" />
        </div>
      </div>
    );
  }
}

export default Board;
