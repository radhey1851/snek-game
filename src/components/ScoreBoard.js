import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ScoreBoard = ({ score: { score, level } }) => {
  return (
    <div className='ScoreBoard DisplayArea'>
      <h5>
        L v L - <span className='lvl'> {level}</span>
      </h5>
      Score <hr /> {score}
      <br /> <br />
    </div>
  );
};

ScoreBoard.propTypes = {
  score: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  score: state.score
});

export default connect(mapStateToProps)(ScoreBoard);
