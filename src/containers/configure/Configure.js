import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Row,
} from 'reactstrap';
import { getConfigure } from '../../apis';
import Logo from '../components/Logo';
import RecentLogins from './RecentLogins';
import ConfigureMetadata from './ConfigureMetadata';
import {
  RoundedContent,
  RoundedWrapper,
} from '../../constants/styles';

const CenteredDivColumn = styled.div`
  float: none;
  margin: 0 auto;
`;

const RoundedCenteredDivColumnContent = styled(RoundedContent)(CenteredDivColumn);
const RoundedCenteredDivColumnWrapper = styled(RoundedWrapper)(CenteredDivColumn);

function Configure(props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [auth] = useState(params.get('auth') === 'true');
  const [loaded, setLoaded] = useState(false);
  const [selectRole] = useState(params.get('select-role') === 'true');
  const [defaultMetadataUrl, setDefaultMetadataUrl] = useState('');
  const [defaultMetadataName, setDefaultMetadataName] = useState('');
  const [metadataUrls, setMetadataUrls] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => getConfigure();

    fetchConfig().then((data) => {
      if (isMounted) {
        setDefaultMetadataUrl(data.defaultMetadataUrl);
        setDefaultMetadataName(data.defaultMetadataName);
        setMetadataUrls(data.metadataUrls);

        setLoaded(true);
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [props]);

  const deleteCallback = (deleted) => {
    const updatedMetadataUrls = metadataUrls
      .filter((metadataUrl) => metadataUrl.profileUuid !== deleted.profileUuid);
    setMetadataUrls(updatedMetadataUrls);
  };

  if (auth) {
    return <Navigate to="/refresh" />;
  }

  if (selectRole) {
    return <Navigate to="/select-role" />;
  }

  if (!loaded) {
    return '';
  }

  return (
    <Container>
      <Row>
        <RoundedCenteredDivColumnWrapper>
          <Logo />
          <RoundedCenteredDivColumnContent>
            <ConfigureMetadata
              defaultMetadataName={defaultMetadataName}
              defaultMetadataUrl={defaultMetadataUrl}
            />
            {!!metadataUrls.length && (
              <RecentLogins
                metadataUrls={metadataUrls}
                deleteCallback={deleteCallback}
              />
            )}
          </RoundedCenteredDivColumnContent>
        </RoundedCenteredDivColumnWrapper>
      </Row>
    </Container>
  );
}

export default Configure;
