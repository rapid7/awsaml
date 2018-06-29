import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export const Error = (props) => {
  return (
    <Alert color="danger">
      <FontAwesomeIcon icon="exclamation-triangle" />
      &nbsp; {props.msg}
    </Alert>
  );
};

Error.propTypes = {
  msg: PropTypes.string.isRequired
};
Error.displayName = 'Error';
