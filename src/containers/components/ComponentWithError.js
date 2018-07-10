import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import hoistNonReactStatic from 'hoist-non-react-statics';

const getErrorClass = (error) => error ? 'form-group has-error' : 'form-group'

export const ComponentWithError = (WrappedComponent) => {
  class ComponentWithError extends Component {
    static propTypes = {
      error: PropTypes.string,
      metadataUrlValid: PropTypes.bool,
    };

    get errorMessage() {
      if (this.hasError()) {
        return !!this.props.error && (
          <Alert color="danger">
            <FontAwesomeIcon icon="exclamation-triangle" />
            &nbsp; {this.props.error}
          </Alert>
        );
      }

      return '';
    }

    hasError() {
      return this.props.error || this.props.metadataUrlValid === false;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          errorMessage={this.errorMessage}
          urlGroupClass={getErrorClass(this.hasError())}
        />
      );
    }
  }

  hoistNonReactStatic(ComponentWithError, WrappedComponent);

  return ComponentWithError;
};
