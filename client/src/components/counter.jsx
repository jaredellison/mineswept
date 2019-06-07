import React from 'react';

const Counter = (props) => {
  const count = props.count || 0;
  const countStr = String(count).padStart(3, "0");
  return (
  <div className="counter">
    {countStr}
  </div>
  )
}

export default Counter;