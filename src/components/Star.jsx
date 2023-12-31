/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

function Star({ grade, setComment, assessment }) {
  const { rating } = assessment;
  return (
    <>
      <input
        type="checkbox"
        id={ `star${grade}` }
        key={ `star${grade}` }
        name="rating"
        value={ grade }
        checked={ Number(grade) <= Number(rating) }
        onChange={ ({ target: { name, value } }) => {
          setComment({ ...assessment, [name]: Number(value) });
        } }
      />
      <label htmlFor={ `star${grade}` } title="text" />
    </>
  );
}

Star.propTypes = {
  grade: PropTypes.number.isRequired,
  setComment: PropTypes.func.isRequired,
  assessment: PropTypes.shape({
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
  }).isRequired,
};

export default Star;
