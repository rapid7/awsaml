import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { getLogout } from '../../apis';
import { BUTTON_MARGIN } from '../../constants/styles';

const ButtonWithMargin = styled(Button)`${BUTTON_MARGIN}`;

function Logout() {
  const [logout, setLogout] = useState(false);

  const handleLogoutEvent = (event) => {
    event.preventDefault();

    getLogout().then(() => {
      setLogout(true);
    }).catch(console.error);
  };

  if (logout) {
    return <Navigate to="/" />;
  }

  return (
    <ButtonWithMargin
      color="danger"
      onClick={handleLogoutEvent}
    >
      Logout
    </ButtonWithMargin>
  );
}

export default Logout;
