import React from 'react';
import Counter from './counter.jsx';
import Smile from './smile.jsx';
import Square from './square.jsx';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: "newGame", // "new game", "playing", "winner", "game over"
      sizeX: 9,
      sizeY: 9,
      mines: 10,
      timeCount: 0,
      flagCount: 0,
      minesMarked: 0,
      squareCounter: null, // adjacent mines 0 -> 8
      squareState: null // "covered", "uncovered", "flagged", "mine"
    };
  }

  componentDidMount() {
    this.startNewGame();
  }

  startNewGame() {
    // create squareState array based on sizeX and sizeY
    // fill board with mines based on this.state.mines
    // calculate square counts based based on mines
  }

  render() {
    return (
      <div class="board">
        board
        <div className="header">
          <Counter/>
          <Smile/>
          <Counter/>
        </div>
        <div className="square-container">
          <Square/>
        </div>
      </div>
    )
  }
}

export default Board;