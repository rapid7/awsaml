'use strict';

const React = require('react');
const DefaultLayout = require('./layouts/default');

const propTypes = {
  error: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  metadataUrl: React.PropTypes.string.isRequired
};

class Configure extends React.Component { // eslint-disable-line react/display-name
  render() {
    let urlGroupClass = 'form-group';

    if (this.props.error) {
      urlGroupClass += ' has-error';
    }
    return (
      <DefaultLayout title={this.props.title}>
        <div className='col-centered rounded-6 wrapper'>
          <img alt='Rapid7'
            className='logo'
            src='https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8'
          />
          <div className='col-centered rounded-6 content'>
            <form method='post'>
              <fieldset>
                <legend>Configure</legend>
                <div className={urlGroupClass}>
                  <label htmlFor='metadataUrl'>SAML Metadata URL</label>
                  <input className='form-control'
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

module.exports = Configure;
