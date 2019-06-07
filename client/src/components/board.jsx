import React from 'react';
import Counter from './counter.jsx';
import Smile from './smile.jsx';
import Square from './square.jsx';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: "newGame", // "new-game", "playing", "winner", "game-over"
      sizeX: 9,
      sizeY: 9,
      mines: 10,
      timeCount: 0,
      flagCount: 0,
      squareCounter: null, // adjacent mines 0 -> 8
      squareStatus: null // "covered", "uncovered", "flagged", "mine"
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
    // fill board with mines based on this.state.mines
    // calculate square counts based based on mines
  }

  startTimer() {
    // Increment game timer each second
    setInterval(() => {
      const time = this.state.timeCount;
      if (time < 999) {
        this.setState(() => ({timeCount: time + 1}));
      }
    }, 1000);
  }

  render() {
    return (
      <div className="board">
        <div className="header">
          <Counter count={this.state.flagCount}/>
          <Smile
            gameOver={this.state.gameState === "game-over"}
            clickHandler={this.startNewGame}
          />
          <Counter count={this.state.timeCount}/>
        </div>
        <div className="square-container">
          <Square status="covered" count="1"/>
        </div>
      </div>
    )
  }
}

export default Board;