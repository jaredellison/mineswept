import React from 'react';

const Counter = (props) => {
  const count = props.count || 0;
  let countStr;

  if (count >= 0) {
    countStr = String(count).padStart(3, '0');
  } else {
    countStr = '-' + String(Math.abs(count)).padStart(2, '0');
  }

  return (
  <div className="counter">
    {countStr}
  </div>
  )
}

export default Counter;