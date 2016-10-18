const React = require('react');
const DefaultLayout = require('./layouts/default');
const Error = require('./error');

const propTypes = {
  defaultMetadataUrl: React.PropTypes.string.isRequired,
  error: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  metadataUrls: React.PropTypes.object.isRequired,
  metadataUrlValid: React.PropTypes.bool
};

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
        <div className='col-centered rounded-6 wrapper'>
          <img
            alt='Rapid7'
            className='logo'
            src='https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8'
          />
          <div className='col-centered rounded-6 content'>
            <form method='post'>
              <fieldset>
                <legend>Configure</legend>
                {this.errorMessage}
                <div className={urlGroupClass}>
                  <label htmlFor='metadataUrl'>SAML Metadata URL</label>
                  <input
                    className='form-control'
                    defaultValue={this.props.defaultMetadataUrl}
                    id='metadataUrl'
                    name='metadataUrl'
                    pattern='https://.+'
                    required
                    type='url'
                  />
                </div>

                <button className='btn btn-default' type='submit'>Done</button>
              </fieldset>
            </form>
            <div id='recent-logins'>
              <h4>Recent Logins</h4>
              <ul className='list-group scrollable-list' id='recent-logins'>{
                Object.keys(this.props.metadataUrls).map((key) => {
                  const pretty = this.props.metadataUrls[key];
                  const urlSelector = `[name="${pretty}"]`;

                  return (
                    <li className='list-group-item' key={key}>
                      <details>
                        <summary>{pretty}</summary>

                        <br/>

                        <div className='input-group'>
                          <input
                            className='form-control' defaultValue={key}
                            name={pretty} readonly // eslint-disable-line react/no-unknown-property
                          />
                          <span className='input-group-btn'>
                            <button
                              className='btn btn-default copy-to-clipboard-button'
                              data-clipboard-target={urlSelector}
                            ><span className='glyphicon glyphicon-copy'/></button>
                          </span>
                        </div>
                      </details>
                    </li>
                  );
                })
              }</ul>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

Configure.propTypes = propTypes;
Configure.displayName = 'Configure';

module.exports = Configure;
