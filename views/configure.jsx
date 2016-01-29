var React = require('react')
var DefaultLayout = require('./layouts/default')

var Configure = React.createClass({
  render: function() {
    var urlGroupClass = 'form-group'
    if (this.props.error) {
      urlGroupClass += ' has-error'
    }

    return (
<DefaultLayout title={this.props.title}>
<div className="col-centered rounded-6 wrapper">
<img className="logo" src="https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8" alt="Rapid7" />
<div className="col-centered rounded-6 content">
<form method="post">
<fieldset>
<legend>Configure</legend>
<div className={urlGroupClass}>
<label htmlFor="metadataUrl">SAML Metadata URL</label>
<input className="form-control" id="metadataUrl" type="url" pattern="https://.+" required name="metadataUrl" defaultValue={this.props.metadataUrl} />
</div>
<button className="btn btn-default" type="submit">Done</button>
</fieldset>
</form>
</div>
</div>
</DefaultLayout>
    )
  }
})

module.exports = Configure
