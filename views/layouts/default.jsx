'use strict';

const React = require('react');

const propTypes = {
  title: React.PropTypes.string.isRequired,
  children: React.PropTypes.element.isRequired
};

class DefaultLayout extends React.Component { // eslint-disable-line react/display-name
  render() {
    return (
      <html lang='en'>
        <head>
          <title>{this.props.title}</title>
          <meta content='width=device-width, initial-scale=1' name='viewport' />
          <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'
            integrity='sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ=='
            rel='stylesheet'
          />
          <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css'
            integrity='sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX'
            rel='stylesheet'
          />
          <link href='/css/app.css' rel='stylesheet' />
        </head>
        <body>
          <div className='container'>
            <div className='row'>
              {this.props.children}
            </div>
          </div>
        </body>
      </html>
    );
  }
}

DefaultLayout.propTypes = propTypes;

module.exports = DefaultLayout;
