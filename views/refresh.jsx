const React = require('react');
const DefaultLayout = require('./layouts/default');

const propTypes = {
  title: React.PropTypes.string.isRequired,
  accountId: React.PropTypes.string.isRequired,
  accessKey: React.PropTypes.string.isRequired,
  secretKey: React.PropTypes.string.isRequired,
  sessionToken: React.PropTypes.string.isRequired
};

class Refresh extends React.Component { // eslint-disable-line react/display-name
  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div className='col-centered rounded-6 wrapper'>
          <img alt='Rapid7'
            className='logo'
            src='https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8'
          />
          <div className='col-centered rounded-6 content'>
            <p>Account ID: {this.props.accountId}</p>
            <p>Access Key: {this.props.accessKey}</p>
            <p>Secret Key: {this.props.secretKey}</p>
            <p>Session Token: {this.props.sessionToken}</p>
            <a className='btn btn-default' href='/refresh' role='button'>Refresh</a>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

Refresh.propTypes = propTypes;

module.exports = Refresh;
