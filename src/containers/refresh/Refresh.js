import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Container, Row} from 'reactstrap';
import {Link, Redirect} from 'react-router-dom';
import styled from 'styled-components';
import {fetchRefresh} from '../../actions/refresh';
import {ComponentWithError} from '../components/ComponentWithError';
import {Logo} from '../components/Logo';
import {Credentials} from './Credentials';
import {Logout} from './Logout';
import {RoundedContent, RoundedWrapper, BUTTON_MARGIN} from '../../constants/styles';

const EnvVar = RoundedContent.extend`
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px 20px;
`;

const LinkWithButtonMargin = styled(Link)`
${BUTTON_MARGIN}
`;

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
          <RoundedWrapper>
            <Logo />
            <RoundedContent>
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
              <EnvVar>
                <p>Run these commands from a {this.term} to use the AWS CLI:</p>
                <pre className={this.lang}>
                  {this.envVars}
                </pre>
              </EnvVar>
              <span className="ml-auto p-2">
                <LinkWithButtonMargin className="btn btn-secondary" onClick={this.handleRefreshClickEvent} role="button" to="/refresh">Refresh</LinkWithButtonMargin>
                <Logout/>
              </span>
            </RoundedContent>
          </RoundedWrapper>
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
