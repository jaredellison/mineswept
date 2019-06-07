import React from 'react';
import Counter from './counter.jsx';
import Smile from './smile.jsx';
import Square from './square.jsx';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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