import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import hoistNonReactStatic from 'hoist-non-react-statics';

const getErrorClass = (error) => (error ? 'form-group has-error' : 'form-group');

function ComponentWithError(WrappedComponent) {
  class InnerComponentWithError extends Component {
    get errorMessage() {
      const {
        error,
      } = this.props;

      if (this.hasError()) {
        return !!error && (
          <Alert color="danger">
            <FontAwesomeIcon icon="exclamation-triangle" />
            &nbsp;
            {error}
          </Alert>
        );
      }

      return '';
    }

    hasError() {
      const {
        error,
        metadataUrlValid,
      } = this.props;

      return error || metadataUrlValid === false;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props} // eslint-disable-line react/jsx-props-no-spreading
          {...this.state} // eslint-disable-line react/jsx-props-no-spreading
          errorMessage={this.errorMessage}
          nameGroupClass="form-group"
          urlGroupClass={getErrorClass(this.hasError())}
        />
      );
    }
  }

  InnerComponentWithError.propTypes = {
    error: PropTypes.string,
    metadataUrlValid: PropTypes.bool,
  };

  hoistNonReactStatic(InnerComponentWithError, WrappedComponent);

  return InnerComponentWithError;
}

export default ComponentWithError;
