import React from 'react';

const Square = props => {
  const status = props.status || "covered";

  return (
    <div className="square" onClick={props.clickHandler}>
      {props.uncovered && props.count}
    </div>
  );
};

export default Square;
