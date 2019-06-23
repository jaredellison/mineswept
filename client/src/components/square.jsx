import React from 'react';

const numberStyling = {
  0: '',
  1: ' number-1',
  2: ' number-2',
  3: ' number-3',
  4: ' number-4',
  5: ' number-5',
  6: ' number-6',
  7: ' number-7',
  8: ' number-8'
};

const Square = props => {
  return (
    <td
      className={
        'square' +
        (props.uncovered && !props.flag ? ' uncovered' : '') +
        (props.losing ? ' losing' : '') +
        (props.count !== null ? numberStyling[props.count] : '')
      }
      onMouseDown={props.clickHandler}
    >
      {props.gameState === 'game-over' && props.mine && !props.flag && '✹'}
      {props.gameState === 'winner' && props.mine && !props.flag && '⚑'}
      {props.flag && '⚑'}
      {props.uncovered && !props.flag && props.count > 0 ? props.count : ' '}
    </td>
  );
};

export default Square;
