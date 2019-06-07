import React from 'react';

const Smile = (props) => (
  <div className="smile" onClick={props.clickHandler}>
    {props.gameOver ? "☺" : "☺" }
  </div>
)

export default Smile;