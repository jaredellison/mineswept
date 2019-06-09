import React from 'react';

const Smile = (props) => {
  let smileCharacter = "🙂";
  if (props.winner) smileCharacter = "😎";
  if (props.gameOver) smileCharacter = "😵";

  return (
    <div className="smile" onClick={props.clickHandler}>
      {smileCharacter}
    </div>
  )
}

export default Smile;