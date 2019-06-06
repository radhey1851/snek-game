import { SET_SCORE, INCREMENT_LEVEL } from './types';

// Set score
export const setScore = () => dispatch => {
  dispatch({
    type: SET_SCORE
  });
};

export const incrementLevel = () => dispatch => {
  dispatch({
    type: INCREMENT_LEVEL
  });
};
