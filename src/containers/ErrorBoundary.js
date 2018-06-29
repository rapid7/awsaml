import React, {Component} from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  componentDidCatch() {
    // Display fallback UI
    this.setState({
      hasError: true
    });

  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
