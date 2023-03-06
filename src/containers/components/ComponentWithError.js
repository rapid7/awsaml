import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getErrorClass = (error) => (error ? 'form-group has-error' : 'form-group');
const hasError = (error, metadataUrlValid) => (error || metadataUrlValid === false);

const errorMessage = (error, metadataUrlValid) => {
  if (hasError(error, metadataUrlValid)) {
    return !!error && (
      <Alert color="danger">
        <FontAwesomeIcon icon="exclamation-triangle" />
        &nbsp;
        {' '}
        {error}
      </Alert>
    );
  }
  return '';
};

export default (WrappedComponent) => {
  function ComponentWithError(props) {
    const {
      error,
      metadataUrlValid,
    } = props;

    return (
      <WrappedComponent
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        errorMessage={errorMessage(error, metadataUrlValid)}
        nameGroupClass="form-group"
        urlGroupClass={getErrorClass(hasError(error, metadataUrlValid))}
      />
    );
  }

  ComponentWithError.propTypes = {
    error: PropTypes.string,
    metadataUrlValid: PropTypes.bool,
  };

  return ComponentWithError;
};
