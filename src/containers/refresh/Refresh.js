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

  showProfileName() {
    return this.props.profileName !== `awsaml-${this.props.accountId}`;
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
                    <summary>Account</summary>
                    <div className="card card-body bg-light mb-3">
                      <dl
                        className="mb-0 p-2 bg-dark text-light"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr',
                        }}
                      >
                        {this.showProfileName() && [
                          <dt
                            className="mr-2"
                            key="profile-name-dt"
                            style={{gridColumn: 1}}
                          >
                            Profile:
                          </dt>,
                          <dd
                            className="mb-0"
                            key="profile-name-dd"
                            style={{gridColumn: 2}}
                          >
                            {profileName}
                          </dd>,
                        ]}
                        <dt
                          className="mr-2"
                          style={{gridColumn: 1}}
                        >
                          ID:
                        </dt>
                        <dd
                          className="mb-0"
                          style={{gridColumn: 2}}
                        >
                          {accountId}
                        </dd>
                        {showRole && [
                          <dt
                            className="mr-2"
                            key="role-name-dt"
                            style={{gridColumn: 1}}
                          >
                            Role:
                          </dt>,
                          <dd
                            className="mb-0"
                            key="role-name-dd"
                            style={{gridColumn: 2}}
                          >
                            {roleName}
                          </dd>,
                        ]}
                      </dl>
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
                      multiLine
                      name="input-envvars"
                      value={getEnvVars(this.props)}
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
