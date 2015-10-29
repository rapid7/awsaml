var React = require('react')

var DefaultLayout = React.createClass({
  render: function() {
    return (
<html lang="en">
<head>
<title>{this.props.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" />
<link rel="stylesheet" href="/css/app.css" />
</head>
<body>
<div className="container-fluid">
<div className="row">
{this.props.children}
</div>
</div>
</body>
</html>
    )
  }
})

module.exports = DefaultLayout
