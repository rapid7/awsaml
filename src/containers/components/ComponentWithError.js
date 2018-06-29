import React, {Component} from 'react';
import {Error} from './Error';

export class ComponentWithError extends Component {
  get errorMessage() {
    if (this.hasError()) {
      return (!this.props.error) ? '' : <Error msg={this.props.error} />;
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
}
