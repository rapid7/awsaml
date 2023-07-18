import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch() {
    // Display fallback UI
    this.setState({
      hasError: true,
    });
  }

  render() {
    const {
      hasError,
    } = this.state;
    const {
      children,
    } = this.props;

    if (hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ErrorBoundary;
