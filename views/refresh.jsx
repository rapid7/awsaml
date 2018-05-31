import React from 'react';
import PropTypes from 'prop-types';
import DefaultLayout from './layouts/default';
import Error from './error';

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

  get envVars() {
    return `
${this.export} AWS_PROFILE=awsaml-${this.props.accountId}
${this.export} AWS_DEFAULT_PROFILE=awsaml-${this.props.accountId}
`.trim();
  }

  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div className="row d-flex p-2">
          <div className="rounded-6 wrapper">
            <img
              alt="Rapid7"
              className="logo"
              src="https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8"
            />
            <div className="rounded-6 content">
              {this.errorMessage}
              <details open>
                <summary>Account ID</summary>
                <div className="card card-body bg-light mb-3">
                  <pre className="card-text">{this.props.accountId}</pre>
                </div>
              </details>
              <details>
                <summary>Credentials</summary>
                <div className="card card-body bg-light mb-3">
                  <dl className="card-text">
                    <dt>Access Key:</dt>
                    <dd>
                      <div className="input-group mb-3">
                        <input
                          className="form-control bg-light"
                          defaultValue={this.props.accessKey}
                          id="access-key"
                          readOnly
                          type="text"
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary copy-to-clipboard-button"
                            data-clipboard-target="#access-key"
                            type="button"
                          >
                            <i className="far fa-copy"/>
                          </button>
                        </div>
                      </div>
                    </dd>
                    <dt>Secret Key:</dt>
                    <dd>
                      <div className="input-group mb-3">
                        <input
                          className="form-control bg-light"
                          defaultValue={this.props.secretKey}
                          id="secret-key"
                          readOnly
                          type="text"
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary copy-to-clipboard-button"
                            data-clipboard-target="#secret-key"
                            type="button"
                          >
                            <i className="far fa-copy"/>
                          </button>
                        </div>
                      </div>
                    </dd>
                    <dt>Session Token:</dt>
                    <dd>
                      <div className="input-group mb-3">
                        <input
                          className="form-control bg-light"
                          defaultValue={this.props.sessionToken}
                          id="session-token"
                          readOnly
                          type="text"
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary copy-to-clipboard-button"
                            data-clipboard-target="#session-token"
                            type="button"
                          >
                            <i className="far fa-copy"/>
                          </button>
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </details>
              <div className="rounded-6 content env-var">
                <p>Run these commands from a {this.term} to use the AWS CLI:</p>
                <pre>
                  <code className={this.lang}>{this.envVars}</code>
                </pre>
              </div>
              <span className="ml-auto p-2">
                <a className="btn btn-secondary button-margin" href="/refresh" role="button">Refresh</a>
                <a className="btn btn-danger button-margin" href="/logout" role="button">Logout</a>
              </span>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}
Refresh.propTypes = {
  error: PropTypes.string,
  title: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
  accessKey: PropTypes.string.isRequired,
  secretKey: PropTypes.string.isRequired,
  sessionToken: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired
};
Refresh.displayName = 'Refresh';

module.exports = Refresh;
