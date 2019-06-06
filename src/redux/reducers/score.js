import { INCREMENT_LEVEL, SET_SCORE } from '../actions/types';

const initialState = {
  score: 0,
  level: 1
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_SCORE:
      return {
        ...state,
        score: state.score + 5
      };
    case INCREMENT_LEVEL:
      return {
        ...state,
        level: state.level + 1
      };
    default:
      return state;
  }
}
