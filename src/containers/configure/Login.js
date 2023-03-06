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
import { postConfigure, deleteProfile } from '../../apis';
import InputGroupWithCopyButton from '../components/InputGroupWithCopyButton';

const ProfileInputGroup = styled(InputGroup)`
  width: 100%;
  height: 2.5em;
  line-height: 2.5em;
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      metadataUrl: url,
      profileName: profileName || pretty,
      profileUuid,
    };

    postConfigure(payload).then(({ redirect }) => {
      if (redirect) {
        document.location.replace(redirect);
      }
    }).catch(console.error);
  };

  const handleDelete = (event) => {
    event.preventDefault();

    const text = `Are you sure you want to delete the profile "${profileName || pretty}"?`;

    // eslint-disable-next-line no-alert
    if (window.confirm(text)) {
      const payload = {
        params: { profileUuid },
      };

      deleteProfile(payload).then(() => {
        deleteCallback(payload);
      }).catch(console.error);
    }
  };

  const handleCollapse = () => {
    setCaretDirection(caretDirection === 'right' ? 'down' : 'right');
    setIsOpen(!isOpen);
  };

  return (
    <ListGroupItem key={url}>
      <ProfileInputGroup>
        <Button
          onClick={handleCollapse}
          outline
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
          outline
        >
          Login
        </Button>
        <Button
          color="danger"
          onClick={handleDelete}
          outline
        >
          <FontAwesomeIcon icon={['far', 'trash-alt']} />
        </Button>
      </ProfileInputGroup>
      <PaddedCollapse isOpen={isOpen}>
        <InputGroupWithCopyButton
          id={profileUuid}
          name={pretty}
          value={url}
        />
      </PaddedCollapse>
    </ListGroupItem>
  );
}

Login.propTypes = {
  pretty: PropTypes.string,
  profileUuid: PropTypes.string,
  url: PropTypes.string,
  deleteCallback: PropTypes.func.isRequired,
};

export default Login;
