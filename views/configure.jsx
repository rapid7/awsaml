const React = require('react');
const DefaultLayout = require('./layouts/default');
const Error = require('./error');

const propTypes = {
  error: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  metadataUrl: React.PropTypes.string.isRequired,
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
                    defaultValue={this.props.metadataUrl}
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
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

Configure.propTypes = propTypes;
Configure.displayName = 'Configure';

module.exports = Configure;
