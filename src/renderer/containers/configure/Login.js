import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  InputGroup,
  Input,
  ListGroupItem,
  Button,
  Collapse,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BORDER_COLOR_SCHEME_MEDIA_QUERY,
} from '../../constants/styles';
import InputGroupWithCopyButton from '../components/InputGroupWithCopyButton';

const ProfileInputGroup = styled(InputGroup)`
  width: 100%;
  height: 2.5em;
  line-height: 2.5em;
`;

const TransparentlistGroupItem = styled(ListGroupItem)`
  background-color: transparent;

  ${BORDER_COLOR_SCHEME_MEDIA_QUERY}
`;

const PaddedCollapse = styled(Collapse)`
  margin-top: 0.4rem;
`;

function Login(props) {
  const {
    url,
    pretty,
    profileUuid,
    deleteCallback,
    errorHandler,
    darkMode,
  } = props;

  const [profileName, setProfileName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [caretDirection, setCaretDirection] = useState('right');

  const handleInputChange = ({ target: { value } }) => {
    setProfileName(value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode !== 32) { // Spacebar
      return;
    }
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.value += ' ';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      metadataUrl: url,
      profileName: profileName || pretty,
      profileUuid,
    };

    const {
      error,
      redirect,
    } = await window.electronAPI.login(payload);

    if (error) {
      errorHandler(error);
    }
    if (redirect) {
      document.location.replace(redirect);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    const text = `Are you sure you want to delete the profile "${profileName || pretty}"?`;

    // eslint-disable-next-line no-alert
    if (window.confirm(text)) {
      const payload = {
        params: { profileUuid },
      };

      await window.electronAPI.deleteProfile({ profileUuid });
      deleteCallback(payload);
    }
  };

  const handleCollapse = () => {
    setCaretDirection(caretDirection === 'right' ? 'down' : 'right');
    setIsOpen(!isOpen);
  };

  return (
    <TransparentlistGroupItem key={url}>
      <ProfileInputGroup>
        <Button
          onClick={handleCollapse}
          outline={!darkMode}
        >
          <FontAwesomeIcon icon={['fas', `fa-caret-${caretDirection}`]} />
        </Button>
        <Input
          className="form-control"
          defaultValue={pretty}
          name="profileName"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
        />
        <Button
          color="secondary"
          onClick={handleSubmit}
          outline={!darkMode}
        >
          Login
        </Button>
        <Button
          color="danger"
          onClick={handleDelete}
          outline={!darkMode}
        >
          <FontAwesomeIcon icon={['far', 'trash-alt']} />
        </Button>
      </ProfileInputGroup>
      <PaddedCollapse isOpen={isOpen}>
        <InputGroupWithCopyButton
          id={profileUuid}
          name={pretty}
          value={url}
          darkMode={darkMode}
        />
      </PaddedCollapse>
    </TransparentlistGroupItem>
  );
}

Login.propTypes = {
  pretty: PropTypes.string,
  profileUuid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

Login.defaultProps = {
  pretty: '',
};

export default Login;
