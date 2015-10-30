var React = require('react')
var DefaultLayout = require('./layouts/default')

var Refresh = React.createClass({
  render: function() {
    return (
<DefaultLayout title={this.props.title}>
<div className="col-centered rounded-6 wrapper">
<img className="logo" src="https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8" alt="Rapid7" />
<div className="col-centered rounded-6 content">
<p>Access Key: <span id="accessKey">{this.props.accessKey}</span></p>
<p>Secret Key: <span id="secretKey">{this.props.secretKey}</span></p>
<a className="btn btn-default" href="/refresh" role="button">Refresh</a>
</div>
</div>
</DefaultLayout>
    )
  }
})

module.exports = Refresh
