const React = require('react');
const DefaultLayout = require('./layouts/default');
const Error = require('./error');

const propTypes = {
  error: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  accountId: React.PropTypes.string.isRequired,
  accessKey: React.PropTypes.string.isRequired,
  secretKey: React.PropTypes.string.isRequired,
  sessionToken: React.PropTypes.string.isRequired,
  platform: React.PropTypes.string.isRequired
};

class Refresh extends React.Component {
  get errorMessage() {
    if (this.props.error) {
      return <Error msg={this.props.error} />;
    }
    return '';
  }

  get platform() {
    return this.props.platform;
  }

  get lang() {
    return (this.platform === 'win32') ? 'language-batch' : 'language-bash';
  }

  get term() {
    return (this.platform === 'win32') ? 'command prompt' : 'terminal';
  }

  get export() {
    return (this.platform === 'win32') ? 'set' : 'export';
  }

  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div className='col-centered rounded-6 wrapper'>
          <img
            alt='Rapid7'
            className='logo'
            src='https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8'
          />
          <div className='col-centered rounded-6 content'>
            {this.errorMessage}
            <details open>
              <summary>Account ID</summary>
              <pre>{this.props.accountId}</pre>
            </details>
            <details>
              <summary>Credentials</summary>
              <dl>
                <dt>Access Key:</dt>
                <dd><pre>{this.props.accessKey}</pre></dd>
                <dt>Secret Key:</dt>
                <dd><pre>{this.props.secretKey}</pre></dd>
                <dt>Session Token:</dt>
                <dd><pre>{this.props.sessionToken}</pre></dd>
              </dl>
            </details>
            <div className='col-centered rounded-12 content env-var'>
              <p>Run these commands from a {this.term} to use the AWS CLI:</p>
              <pre>
                <code className={this.lang}>
                  {this.export} AWS_PROFILE=awsaml-{this.props.accountId}{'\n'}
                  {this.export} AWS_DEFAULT_PROFILE=awsaml-{this.props.accountId}
                </code>
              </pre>
            </div>
            <a className='btn btn-default button-margin' href='/refresh' role='button'>Refresh</a>
            <a className='btn btn-danger button-margin' href='/logout' role='button'>Logout</a>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}
Refresh.propTypes = propTypes;
Refresh.displayName = 'Refresh';

module.exports = Refresh;
