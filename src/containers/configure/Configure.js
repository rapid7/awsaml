import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Row,
} from 'reactstrap';
import Logo from '../components/Logo';
import RecentLogins from './RecentLogins';
import ConfigureMetadata from './ConfigureMetadata';
import {
  RoundedContent,
  RoundedWrapper,
} from '../../constants/styles';
import Error from '../components/Error';

const CenteredDivColumn = styled.div`
  float: none;
  margin: 0 auto;
`;

const RoundedCenteredDivColumnContent = styled(RoundedContent)(CenteredDivColumn);
const RoundedCenteredDivColumnWrapper = styled(RoundedWrapper)(CenteredDivColumn);

function Configure() {
  const [auth, setAuth] = useState(false);
  const [selectRole, setSelectRole] = useState(false);

  const [metadataUrlValid, setMetadataUrlValid] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const isAuthenticated = await window.electronAPI.isAuthenticated();
      setAuth(isAuthenticated);

      const mustSelectRole = await window.electronAPI.hasMultipleRoles();
      setSelectRole(mustSelectRole);
    })();

    return () => {};
  });
  const errorHandler = (err) => {
    console.error(err); // eslint-disable-line no-console
    setError(err);
  };

  if (auth) {
    return <Navigate to="/refresh" />;
  }

  if (selectRole) {
    return <Navigate to="/select-role" />;
  }

  return (
    <Container>
      <Row>
        <RoundedCenteredDivColumnWrapper>
          <Logo />
          <RoundedCenteredDivColumnContent>
            <Error error={error} metadataUrlValid={metadataUrlValid} />
            <ConfigureMetadata
              setError={setError}
              setMetadataUrlValid={setMetadataUrlValid}
            />
            <RecentLogins
              errorHandler={errorHandler}
            />
          </RoundedCenteredDivColumnContent>
        </RoundedCenteredDivColumnWrapper>
      </Row>
    </Container>
  );
}

export default Configure;
