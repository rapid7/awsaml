import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { BUTTON_MARGIN } from '../../constants/styles';

const ButtonWithMargin = styled(Button)`${BUTTON_MARGIN}`;

function Logout({ darkMode }) {
  const [logout, setLogout] = useState(false);

  const handleLogoutEvent = async (event) => {
    event.preventDefault();

    const data = await window.electronAPI.logout();
    setLogout(data.logout);
  };

  if (logout) {
    return <Navigate to="/" />;
  }

  return (
    <ButtonWithMargin
      color="danger"
      onClick={handleLogoutEvent}
      outline={!darkMode}
    >
      Logout
    </ButtonWithMargin>
  );
}

Logout.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default Logout;
