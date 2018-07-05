import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Container, Row} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
import {fetchRefresh} from '../../actions/refresh';
import {ComponentWithError} from '../components/ComponentWithError';
import {Logo} from '../components/Logo';
import {Credentials} from './Credentials';
import {Logout} from './Logout';

class Refresh extends Component {
  state = {
    loaded: false
  };

  async componentDidMount() {
    this._isMounted = true;

    await this.props.fetchRefresh();
    if (this._isMounted) {
      this.setState({
        loaded: true
      });
    }
  }

  componentDidUpdate() {
    if (this.props.redirect) {
      window.location.href = this.props.redirect;
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  get platform() {
    return this.props.platform;
  }

  get lang() {
    return (this.platform === 'win32') ? 'language-batch' : 'language-bash';
  }

  get term() {
    return (this.platform === 'win32') ? 'command prompt' : 'terminal';
  }

  get export() {
    return (this.platform === 'win32') ? 'set' : 'export';
  }

  get envVars() {
    return `
${this.export} AWS_PROFILE=awsaml-${this.props.accountId}
${this.export} AWS_DEFAULT_PROFILE=awsaml-${this.props.accountId}
`.trim();
  }

  handleRefreshClickEvent = (event) => {
    event.preventDefault();
    this.props.fetchRefresh();
  };

  render() {
    if (this.props.status === 401) {
      return <Redirect to="/" />
    }

    return (this.state.loaded) ? (
      <Container>
        <Row className="d-flex p-2">
          <div className="rounded-6 wrapper">
            <Logo />
            <div className="rounded-6 content">
              {this.props.errorMessage}
              <details open>
                <summary>Account ID</summary>
                <div className="card card-body bg-light mb-3">
                  <pre className="card-text language-markup">
                    <code>{this.props.accountId}</code>
                  </pre>
                </div>
              </details>
              <Credentials
                awsAccessKey={this.props.accessKey}
                awsSecretKey={this.props.secretKey}
                awsSessionToken={this.props.sessionToken}
              />
              <div className="rounded-6 content env-var">
                <p>Run these commands from a {this.term} to use the AWS CLI:</p>
                <pre className={this.lang}>
                  {this.envVars}
                </pre>
              </div>
              <span className="ml-auto p-2">
                <Link className="btn btn-secondary button-margin" onClick={this.handleRefreshClickEvent} role="button" to="/refresh">Refresh</Link>
                <Logout/>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    ) : '';
  }
}

const mapStateToProps = ({refresh}) => {

  return {
    ...refresh.fetchFailure,
    ...refresh.fetchSuccess
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRefresh: bindActionCreators(fetchRefresh, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComponentWithError(Refresh));
