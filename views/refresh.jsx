const React = require('react');
const DefaultLayout = require('./layouts/default');

const propTypes = {
  title: React.PropTypes.string.isRequired,
  accountId: React.PropTypes.string.isRequired,
  accessKey: React.PropTypes.string.isRequired,
  secretKey: React.PropTypes.string.isRequired,
  sessionToken: React.PropTypes.string.isRequired,
  platform: React.PropTypes.string.isRequired
};

class Refresh extends React.Component {

  get platform() {
    return this.props.platform;
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
          <img alt='Rapid7'
            className='logo'
            src='https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8'
          />
          <div className='col-centered rounded-6 content'>
            <dl>
              <dt>Account ID:</dt>
              <dd>{this.props.accountId}</dd>
              <dt>Access Key:</dt>
              <dd>{this.props.accessKey}</dd>
              <dt>Secret Key:</dt>
              <dd>{this.props.secretKey}</dd>
              <dt>Session Token:</dt>
              <dd>{this.props.sessionToken}</dd>
            </dl>
            <div className='col-centered rounded-12 content env-var'>
              <p>Run these commands from a {this.term} to use the AWS CLI:</p>
              <pre>
                <code className='language-powershell'>
                  {this.export} AWS_PROFILE=awsaml-{this.props.accountId}<br/>
                  {this.export} AWS_DEFAULT_PROFILE=awsaml-{this.props.accountId}
                </code>
              </pre>
            </div>
            <a className='btn btn-default' href='/refresh' role='button'>Refresh</a>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

Refresh.propTypes = propTypes;
Refresh.displayName = 'Refresh';

module.exports = Refresh;
