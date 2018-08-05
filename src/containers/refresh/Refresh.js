import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {
  Container,
  Row
} from 'reactstrap';
import {
  Link,
  Redirect
} from 'react-router-dom';
import styled from 'styled-components';
import {fetchRefresh} from '../../actions/refresh';
import {ComponentWithError} from '../components/ComponentWithError';
import {Logo} from '../components/Logo';
import {Credentials} from './Credentials';
import {Logout} from './Logout';
import {RenderIfLoaded} from '../components/RenderIfLoaded';
import {InputGroupWithCopyButton} from '../components/InputGroupWithCopyButton';
import {
  RoundedContent,
  RoundedWrapper,
  BUTTON_MARGIN
} from '../../constants/styles';

const EnvVar = RoundedContent.extend`
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px 20px;
`;

const LinkWithButtonMargin = styled(Link)`
${BUTTON_MARGIN}
`;

const getLang = (platform) => platform === 'win32' ? 'language-batch' : 'language-bash';

const getTerm = (platform) => platform === 'win32' ? 'command prompt' : 'terminal';

const getExport = (platform) => platform === 'win32' ? 'set' : 'export';

const getEnvVars = ({platform, accountId}) => `
${getExport(platform)} AWS_PROFILE=awsaml-${accountId}
${getExport(platform)} AWS_DEFAULT_PROFILE=awsaml-${accountId}
`.trim();

class Refresh extends Component {
  static propTypes = {
    accessKey: PropTypes.string,
    accountId: PropTypes.string,
    errorMessage: PropTypes.string,
    fetchRefresh: PropTypes.func,
    platform: PropTypes.string,
    redirect: PropTypes.bool,
    secretKey: PropTypes.string,
    sessionToken: PropTypes.string,
    status: PropTypes.number,
  };


  state = {
    loaded: false,
  };

  async componentDidMount() {
    this._isMounted = true;

    await this.props.fetchRefresh();
    if (this._isMounted) {
      this.setState({
        loaded: true,
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

  handleRefreshClickEvent = (event) => {
    event.preventDefault();
    this.props.fetchRefresh();
  };

  render() {
    const {
      errorMessage,
      status,
      accountId,
      accessKey,
      secretKey,
      sessionToken,
      platform,
    } = this.props;

    if (status === 401) {
      return <Redirect to="/" />;
    }

    return (
      <RenderIfLoaded isLoaded={this.state.loaded}>
        {() => (
          <Container>
            <Row className="d-flex p-2">
              <RoundedWrapper>
                <Logo />
                <RoundedContent>
                  {errorMessage}
                  <details open>
                    <summary>Account ID</summary>
                    <div className="card card-body bg-light mb-3">
                      <pre className="card-text language-markup">
                        <code>{accountId}</code>
                      </pre>
                    </div>
                  </details>
                  <Credentials
                    awsAccessKey={accessKey}
                    awsSecretKey={secretKey}
                    awsSessionToken={sessionToken}
                  />
                  <EnvVar>
                    <p>Run these commands from a {getTerm(platform)} to use the AWS CLI:</p>
                    <InputGroupWithCopyButton
                      className={getLang(platform)}
                      id="envvars"
                      name="input-envvars"
                      value={getEnvVars(this.props)}
                      multiLine={true}
                    />
                  </EnvVar>
                  <span className="ml-auto p-2">
                    <LinkWithButtonMargin
                      className="btn btn-secondary"
                      onClick={this.handleRefreshClickEvent}
                      role="button"
                      to="/refresh"
                    >
                      Refresh
                    </LinkWithButtonMargin>
                    <Logout/>
                  </span>
                </RoundedContent>
              </RoundedWrapper>
            </Row>
          </Container>
        )}
      </RenderIfLoaded>
    );
  }
}

const mapStateToProps = ({refresh}) => ({
  ...refresh.fetchFailure,
  ...refresh.fetchSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRefresh: bindActionCreators(fetchRefresh, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentWithError(Refresh));
