import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Error(props) {
  const {
    error,
    metadataUrlValid,
  } = props;

  return (error || metadataUrlValid === false) ? (
    <Alert color="danger" fade={false}>
      <FontAwesomeIcon icon="exclamation-triangle" />
      {'  '}
      {error}
    </Alert>
  ) : '';
}

Error.propTypes = {
  error: PropTypes.string,
  metadataUrlValid: PropTypes.bool,
};

Error.defaultProps = {
  error: '',
  metadataUrlValid: true,
};

export default Error;
