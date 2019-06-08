import React from 'react';

const Square = props => {
  return (
    <div className={"square" + (props.uncovered && !props.flag ? " uncovered" : "")} onClick={props.clickHandler}>
      {props.gameState === "game-over" && props.mine && !props.flag && "✹"}
      {props.flag && "⚑"}
      {props.uncovered && !props.flag && props.count}
    </div>
  );
};

export default Square;
