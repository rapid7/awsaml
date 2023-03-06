import React, { useState, useEffect } from 'react';
import {
  Container,
  ListGroup,
  Row,
} from 'reactstrap';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getSelectRole } from '../../apis';
import ComponentWithError from '../components/ComponentWithError';
import Role from './Role';
import Logo from '../components/Logo';
import {
  RoundedContent,
  RoundedWrapper,
} from '../../constants/styles';

const SelectRoleHeader = styled.h4`
  margin-top: 15px;
  padding-top: 15px;
`;

function SelectRole(props) {
  const {
    errorMessage,
  } = props;

  const [loaded, setLoaded] = useState(false);
  const [displayAccountId, setDisplayAccountId] = useState(true);
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchRole = async () => getSelectRole();

    fetchRole().then((data) => {
      if (isMounted) {
        setLoaded(true);

        setRoles(data.roles);
        const uniqueAccountIds = new Set(data.roles.map((role) => role.accountId));

        if (uniqueAccountIds.size === 1) {
          setDisplayAccountId(false);
        }
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [props]);

  const selectStatusCallback = (payload) => {
    setStatus(payload.status);
  };

  if (status === 'selected') {
    return <Navigate to="/refresh" />;
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

            <SelectRoleHeader>Select a role:</SelectRoleHeader>
            <ListGroup>
              {
                roles.map((role) => (
                  <Role
                    accountId={role.accountId}
                    displayAccountId={displayAccountId}
                    index={role.index}
                    key={`role-item-${role.index}`}
                    name={role.roleName}
                    principalArn={role.principalArn}
                    roleArn={role.roleArn}
                    selectStatusCallback={selectStatusCallback}
                  />
                ))
              }
            </ListGroup>
          </RoundedContent>
        </RoundedWrapper>
      </Row>
    </Container>
  );
}

SelectRole.propTypes = {
  errorMessage: PropTypes.string,
};

SelectRole.defaultProps = {
  errorMessage: '',
};

export default ComponentWithError(SelectRole);
