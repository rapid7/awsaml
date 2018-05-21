import React from 'react';
import PropTypes from 'prop-types';

const Error = function render(props) {
  return (
    <div
      className="alert alert-danger"
      role="alert"
    >
      <span className="glyphicon glyphicon-exclamation-sign" />
      &nbsp; {props.msg}
    </div>
  );
};

Error.propTypes = {
  msg: PropTypes.string.isRequired
};
Error.displayName = 'Error';

module.exports = Error;
