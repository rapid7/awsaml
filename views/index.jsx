require('../public/css/app.css');

const React = require('react');
const ReactDOM = require('react-dom');

class Index extends React.Component {
  componentDidMount() {
    document.title = 'Awsaml';
  }

  render() {
    return (
      <div></div>
    );
  }
}

Index.displayName = 'Index';

ReactDOM.render(<Index/>, document.getElementById('content'));
