import React from 'react';

const Square = props => {
  const status = props.status || "covered";

  return (
    <div className="square">
      {props.status === 'covered' && 'c'}
      {props.status === 'flagged' && 'f'}
      {props.status === 'mine' && 'm'}
      {props.status === 'uncovered' && props.count}
    </div>
  );
};

export default Square;
