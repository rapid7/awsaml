import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'reactstrap';
import styled from 'styled-components';
import {
  BORDER_COLOR_SCHEME_MEDIA_QUERY,
} from '../../constants/styles';

const SelectRoleButton = styled(ListGroupItem)`
  cursor: pointer;
  background-color: transparent;

  ${BORDER_COLOR_SCHEME_MEDIA_QUERY}

  margin-right: 0.8em;
  padding-left: 0.5em;
  padding-right: 0.5em;
`;

function Role(props) {
  const {
    displayAccountId,
    name,
    accountId,
    onClick,
  } = props;

  const displayName = displayAccountId ? `${accountId}:${name}` : name;

  return (
    <SelectRoleButton
      action
      onClick={onClick}
      tag="button"
    >
      {displayName}
    </SelectRoleButton>
  );
}

Role.propTypes = {
  accountId: PropTypes.string.isRequired,
  displayAccountId: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Role;
