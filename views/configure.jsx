import React from 'react';
import PropTypes from 'prop-types';
import DefaultLayout from './layouts/default';
import Error from './error';

class Configure extends React.Component {
  get errorMessage() {
    if (this.hasError()) {
      return (!this.props.error) ? '' : <Error msg={this.props.error} />;
    }

    return '';
  }

  hasError() {
    return (this.props.error || this.props.metadataUrlValid === false);
  }

  render() {
    let urlGroupClass = 'form-group';

    if (this.hasError()) {
      urlGroupClass += ' has-error';
    }

    return (
      <DefaultLayout title={this.props.title}>
        <div className="row">
          <div className="col-centered rounded-6 wrapper">
            <img
              alt="Rapid7"
              className="logo"
              src="https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8"
            />
            <div className="col-centered rounded-6 content">
              <form method="post">
                <fieldset>
                  <legend>Configure</legend>
                  {this.errorMessage}
                  <div className={urlGroupClass}>
                    <label htmlFor="metadataUrl">SAML Metadata URL</label>
                    <input
                      className="form-control"
                      defaultValue={this.props.defaultMetadataUrl}
                      id="metadataUrl"
                      name="metadataUrl"
                      pattern="https://.+"
                      required
                      type="url"
                    />
                  </div>
                  <button className="btn btn-outline-primary" type="submit">Done</button>
                </fieldset>
              </form>
              <div id="recent-logins">
                <h4>Recent Logins</h4>
                <ul className="list-group scrollable-list" id="recent-logins">
                  {
                    Object.keys(this.props.metadataUrls).map((key) => {
                      const pretty = this.props.metadataUrls[key];

                      return (
                        <li className="list-group-item" key={key}>
                          <form method="post">
                            <details>
                              <summary>
                                <div className="input-group profile">
                                  <input
                                    className="form-control"
                                    defaultValue={pretty}
                                    name="profileName"
                                    type="text"
                                  />
                                  <input
                                    className="form-control"
                                    defaultValue={key}
                                    id="metadataUrl"
                                    name="metadataUrl"
                                    type="hidden"
                                  />
                                  <div className="input-group-append">
                                    <button className="login-button btn btn-outline-secondary" type="submit">Login</button>
                                  </div>
                                </div>
                              </summary>

                              <br/>

                              <div className="input-group mb-3">
                                <input
                                  className="form-control"
                                  defaultValue={key}
                                  id={pretty}
                                  name={pretty}
                                  readOnly
                                  type="url"
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-outline-secondary copy-to-clipboard-button"
                                    data-clipboard-target={`#${pretty}`}
                                    type="button"
                                  >
                                    <i className="far fa-copy"/>
                                  </button>
                                </div>
                              </div>
                            </details>
                          </form>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

Configure.propTypes = {
  defaultMetadataUrl: PropTypes.string.isRequired,
  error: PropTypes.string,
  title: PropTypes.string.isRequired,
  metadataUrls: PropTypes.object.isRequired,
  metadataUrlValid: PropTypes.bool
};
Configure.displayName = 'Configure';

module.exports = Configure;
