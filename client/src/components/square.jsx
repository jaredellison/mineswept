import React from 'react';

const Square = props => {
  return (
    <td
      className={"square" + (props.uncovered && !props.flag ? " uncovered" : "")}
      onMouseDown={props.clickHandler}
    >
      {props.gameState === "game-over" && props.mine && !props.flag && "✹"}
      {props.flag && "⚑"}
      {props.uncovered && !props.flag && props.count}
    </td>
  );
};

export default Square;
