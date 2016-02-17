'use strict';

const React = require('react');

const propTypes = {
  msg: React.PropTypes.string.isRequired
};

class Error extends React.Component {
  render() {
    return (
        <div className='alert alert-danger' role='alert'>
          <span className='glyphicon glyphicon-exclamation-sign' />
          &nbsp;{this.props.msg}
        </div>
    );
  }
}

Error.propTypes = propTypes;
Error.displayName = 'Error';

module.exports = Error;
