import React, {Component} from 'react';
import {Alert} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import hoistNonReactStatic from 'hoist-non-react-statics';

export const ComponentWithError = (WrappedComponent) => {
  class ComponentWithError extends Component {
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
      return (this.props.error || this.props.metadataUrlValid === false);
    }

    get urlGroupClass() {
      let urlGroupClass = 'form-group';

      if (this.hasError()) {
        urlGroupClass += ' has-error';
      }

      return urlGroupClass;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          errorMessage={this.errorMessage}
          urlGroupClass={this.urlGroupClass}/>
      )
    }
  }

  hoistNonReactStatic(ComponentWithError, WrappedComponent);

  return ComponentWithError;
};
