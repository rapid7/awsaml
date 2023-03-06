import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Button,
  Collapse,
} from 'reactstrap';
import {
  Link,
  Redirect,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { fetchRefresh } from '../../actions/refresh';
import ComponentWithError from '../components/ComponentWithError';
import Logo from '../components/Logo';
import Credentials from './Credentials';
import Logout from './Logout';
import RenderIfLoaded from '../components/RenderIfLoaded';
import InputGroupWithCopyButton from '../components/InputGroupWithCopyButton';
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

const BorderlessButton = styled(Button)`
  border: 0;
  margin-bottom: 3px;
`;

const getLang = (platform) => (platform === 'win32' ? 'language-batch' : 'language-bash');

const getTerm = (platform) => (platform === 'win32' ? 'command prompt' : 'terminal');

const getExport = (platform) => (platform === 'win32' ? 'set' : 'export');

const getEnvVars = ({ platform, accountId }) => `
${getExport(platform)} AWS_PROFILE=awsaml-${accountId}
${getExport(platform)} AWS_DEFAULT_PROFILE=awsaml-${accountId}
`.trim();

class Refresh extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      caretDirection: 'down',
      isOpen: true,
    };
  }

  async componentDidMount() {
    const {
      fetchRefresh: fr,
    } = this.props;

    this._isMounted = true; // eslint-disable-line no-underscore-dangle

    await fr();
    if (this._isMounted) { // eslint-disable-line no-underscore-dangle
      this.setState({
        loaded: true,
      });
    }
  }

  componentDidUpdate() {
    const {
      redirect,
    } = this.props;

    if (redirect) {
      window.location.href = redirect;
    }
  }

  componentWillUnmount() {
    this._isMounted = false; // eslint-disable-line no-underscore-dangle
  }

  handleRefreshClickEvent = (event) => {
    const {
      fetchRefresh: fr,
    } = this.props;

    event.preventDefault();

    fr();
  };

  handleCollapse = () => {
    const {
      caretDirection,
      isOpen,
    } = this.state;
    const newCaretDirection = (caretDirection === 'right' ? 'down' : 'right');
    this.setState({
      caretDirection: newCaretDirection,
      isOpen: !isOpen,
    });
  };

  showProfileName() {
    const {
      profileName,
      accountId,
    } = this.props;

    return profileName !== `awsaml-${accountId}`;
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
    const {
      loaded,
      caretDirection,
      isOpen,
    } = this.state;

    if (status === 401) {
      return <Redirect to="/" />;
    }

    return (
      <RenderIfLoaded isLoaded={loaded}>
        {() => (
          <Container>
            <Row className="d-flex p-2">
              <RoundedWrapper>
                <Logo />
                <RoundedContent>
                  {errorMessage}
                  <div>
                    <BorderlessButton
                      onClick={this.handleCollapse}
                      outline
                      color="link"
                    >
                      <FontAwesomeIcon icon={['fas', `fa-caret-${caretDirection}`]} />
                      &nbsp;&nbsp;&nbsp;Account
                    </BorderlessButton>
                    <Collapse isOpen={isOpen}>
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
                    </Collapse>
                  </div>
                  <Credentials
                    awsAccessKey={accessKey}
                    awsSecretKey={secretKey}
                    awsSessionToken={sessionToken}
                  />
                  <EnvVar>
                    <p>
                      Run these commands from a&nbsp;
                      {getTerm(platform)}
                      &nbsp;to use the AWS CLI:
                    </p>
                    <PreInputGroupWithCopyButton
                      buttonClassName="bg-dark text-light"
                      id="envvars"
                      inputClassName={`bg-dark text-light ${getLang(platform)}`}
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
                    <Logout />
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

Refresh.propTypes = {
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

const mapStateToProps = ({ refresh }) => ({
  ...refresh.fetchFailure,
  ...refresh.fetchSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRefresh: bindActionCreators(fetchRefresh, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentWithError(Refresh));
