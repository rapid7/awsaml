var React = require('react')
var DefaultLayout = require('./layouts/default')

var Refresh = React.createClass({
  render: function() {
    return (
<DefaultLayout title={this.props.title}>
<div className="col-xs-9 col-centered widget">
<p>Access Key: <span id="accessKey">{this.props.accessKey}</span></p>
<p>Secret Key: <span id="secretKey">{this.props.secretKey}</span></p>
<a className="btn btn-default" href="/refresh" role="button">Refresh</a>
</div>
</DefaultLayout>
    )
  }
})

module.exports = Refresh
