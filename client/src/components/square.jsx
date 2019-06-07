import React from 'react';

const Square = props => {
  return (
    <div className={"square" + (props.uncovered ? " uncovered" : "")} onClick={props.clickHandler}>
      {props.uncovered && props.count}
    </div>
  );
};

export default Square;
