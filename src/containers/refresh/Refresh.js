import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
} from 'reactstrap';
import {
  Link,
  Redirect,
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
  BUTTON_MARGIN,
} from '../../constants/styles';

const EnvVar = RoundedContent.extend`
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px 20px;
`;

const LinkWithButtonMargin = styled(Link)`
${BUTTON_MARGIN}
`;

const AccountProps = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  margin: 0;
  padding: .5rem;
`;

const AccountPropsKey = styled.dt`
  grid-column: 1;
  margin-right: .5rem;
`;

const AccountPropsVal = styled.dd`
  grid-column: 2;
  margin-bottom: 0;
`;

const PreInputGroupWithCopyButton = styled(InputGroupWithCopyButton)`
  font-family: Consolas,monospace;
  font-size: 1rem;
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
    profileName: PropTypes.string,
    redirect: PropTypes.bool,
    roleName: PropTypes.string,
    secretKey: PropTypes.string,
    sessionToken: PropTypes.string,
    showRole: PropTypes.bool,
    status: PropTypes.number,
  };


  state = {
    loaded: false,
  };

  async componentDidMount() {
    this.interval = setInterval(() => this.setState({ts: new Date()}), 1000)
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
    clearInterval(this.interval);
    this._isMounted = false;
  }

  handleRefreshClickEvent = (event) => {
    event.preventDefault();
    this.props.fetchRefresh();
  };

  showProfileName() {
    return this.props.profileName !== `awsaml-${this.props.accountId}`;
  }

  relativeDate(date) {
    const deltaSeconds = (new Date(date) - new Date()) / 1000;
    let relative = "";

    const hours = Math.floor(deltaSeconds / 3600);
    const minutes = Math.floor((deltaSeconds % 3600) / 60);
    const seconds = Math.floor(deltaSeconds % 60);

    if (hours) relative += `${hours}h`;
    if (minutes) relative += `${minutes}m`;
    if (seconds) relative += `${seconds}s`;

    return relative;
  }

  render() {
    const {
      errorMessage,
      status,
      accountId,
      showRole,
      roleName,
      accessKey,
      secretKey,
      sessionToken,
      platform,
      profileName,
      expiration,
    } = this.props;
    const localExpiration = new Date(expiration);

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
                    <summary>Account</summary>
                    <div className="card card-body bg-light mb-3">
                      <AccountProps className="bg-dark text-light">
                        {this.showProfileName() && [
                          <AccountPropsKey key="profile-name-dt">Profile:</AccountPropsKey>,
                          <AccountPropsVal key="profile-name-dd">{profileName}</AccountPropsVal>,
                        ]}
                        <AccountPropsKey>ID:</AccountPropsKey>
                        <AccountPropsVal>{accountId}</AccountPropsVal>
                        {showRole && [
                          <AccountPropsKey key="role-name-dt">Role:</AccountPropsKey>,
                          <AccountPropsVal key="role-name-dd">{roleName}</AccountPropsVal>,
                        ]}
                      </AccountProps>
                    </div>
                  </details>
                  <Credentials
                    awsAccessKey={accessKey}
                    awsSecretKey={secretKey}
                    awsSessionToken={sessionToken}
                  />
                  <EnvVar>
                    <p>Run these commands from a {getTerm(platform)} to use the AWS CLI:</p>
                    <PreInputGroupWithCopyButton
                      buttonClassName="bg-dark text-light"
                      id="envvars"
                      inputClassName={`bg-dark text-light ${getLang(platform)}`}
                      multiLine
                      name="input-envvars"
                      value={getEnvVars(this.props)}
                    />
                  </EnvVar>
                  <div><b>Expires in:</b> {this.relativeDate(expiration)}</div>
                  <div class="mb-3"><b>Expires at:</b> {localExpiration.toString()}</div>
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
