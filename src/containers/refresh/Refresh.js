import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Button,
  Collapse,
} from 'reactstrap';
import {
  Link,
  Navigate,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { getRefresh } from '../../apis';
import ComponentWithError from '../components/ComponentWithError';
import Logo from '../components/Logo';
import Credentials from './Credentials';
import Logout from './Logout';
import InputGroupWithCopyButton from '../components/InputGroupWithCopyButton';
import {
  RoundedContent,
  RoundedWrapper,
  BUTTON_MARGIN,
} from '../../constants/styles';

const EnvVar = styled(RoundedContent)`
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

function Refresh(props) {
  const {
    errorMessage,
    status,
  } = props;

  const [loaded, setLoaded] = useState(false);
  const [caretDirection, setCaretDirection] = useState('down');
  const [isOpen, setIsOpen] = useState(true);
  const [credentials, setCredentials] = useState({
    accessKey: '',
    secretKey: '',
    sessionToken: '',
  });
  const [accountId, setAccountId] = useState('');
  const [platform, setPlatform] = useState('');
  const [profileName, setProfileName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [showRole, setShowRole] = useState(false);

  const { accessKey, secretKey, sessionToken } = credentials;

  const get = async () => getRefresh();
  const getSuccessCallback = (data) => {
    setAccountId(data.accountId);
    setCredentials({
      accessKey: data.accessKey,
      secretKey: data.secretKey,
      sessionToken: data.sessionToken,
    });

    setPlatform(data.platform);
    setProfileName(data.profileName);
    setRoleName(data.roleName);
    setShowRole(data.showRole);
  };

  useEffect(() => {
    let isMounted = true;

    get().then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      }

      if (isMounted) {
        setLoaded(true);
        getSuccessCallback(data);
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [props]);

  const handleRefreshClickEvent = (event) => {
    event.preventDefault();

    get().then(getSuccessCallback).catch(console.error);
  };

  const handleCollapse = () => {
    setCaretDirection(caretDirection === 'right' ? 'down' : 'right');
    setIsOpen(!isOpen);
  };

  if (status === 401) {
    return <Navigate to="/" />;
  }

  if (!loaded) {
    return ('');
  }

  return (
    <Container>
      <Row className="d-flex p-2">
        <RoundedWrapper>
          <Logo />
          <RoundedContent>
            {errorMessage}
            <div>
              <BorderlessButton
                onClick={handleCollapse}
                outline
                color="link"
              >
                <FontAwesomeIcon icon={['fas', `fa-caret-${caretDirection}`]} />
                &nbsp;&nbsp;&nbsp;Account
              </BorderlessButton>
              <Collapse isOpen={isOpen}>
                <div className="card card-body bg-light mb-3">
                  <AccountProps className="bg-dark text-light">
                    {profileName !== `awsaml-${accountId}` && [
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
                value={getEnvVars({ platform, accountId })}
              />
            </EnvVar>
            <span className="ml-auto p-2">
              <LinkWithButtonMargin
                className="btn btn-secondary"
                onClick={handleRefreshClickEvent}
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
  );
}

Refresh.propTypes = {
  errorMessage: PropTypes.string,
  status: PropTypes.number,
};

Refresh.defaultProps = {
  errorMessage: '',
};

export default ComponentWithError(Refresh);
