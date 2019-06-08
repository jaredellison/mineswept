import React from 'react';

const Square = props => {
  return (
    <div className={"square" + (props.uncovered ? " uncovered" : "")} onClick={props.clickHandler}>
      {props.gameState === "game-over" && props.mine && "💣"}
      {props.uncovered && props.count}
    </div>
  );
};

export default Square;
