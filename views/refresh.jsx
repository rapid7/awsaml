var React = require('react')
var DefaultLayout = require('./layouts/default')

var Refresh = React.createClass({
  render: function() {
    return (
<DefaultLayout title={this.props.title}>
<div className="col-centered rounded-6 wrapper">
<img className="logo" src="https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8" alt="Rapid7" />
<div className="col-centered rounded-6 content">
<p>Account ID: {this.props.accountId}</p>
<p>Access Key: {this.props.accessKey}</p>
<p>Secret Key: {this.props.secretKey}</p>
<p>Session Token: {this.props.sessionToken}</p>
<a className="btn btn-default" href="/refresh" role="button">Refresh</a>
</div>
</div>
</DefaultLayout>
    )
  }
})

module.exports = Refresh
