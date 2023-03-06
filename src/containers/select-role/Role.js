import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'reactstrap';
import styled from 'styled-components';
import { postSelectRole } from '../../apis';

const SelectRoleButton = styled(ListGroupItem)`
  cursor: pointer;
`;

function Role(props) {
  const {
    displayAccountId,
    name,
    accountId,
    index,
    selectStatusCallback,
  } = props;

  const handleClick = (event) => {
    event.preventDefault();

    const selectRole = async () => postSelectRole({ index });

    selectRole().then((data) => {
      selectStatusCallback(data);
    }).catch(console.error);
  };

  const displayName = displayAccountId ? `${accountId}:${name}` : name;

  return (
    <SelectRoleButton
      action
      onClick={handleClick}
      tag="button"
    >
      {displayName}
    </SelectRoleButton>
  );
}

Role.propTypes = {
  accountId: PropTypes.string.isRequired,
  displayAccountId: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  selectStatusCallback: PropTypes.func,
};

export default Role;
