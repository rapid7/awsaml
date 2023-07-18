import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
} from 'reactstrap';
import styled from 'styled-components';

const FullSizeLabel = styled.label`
  width: 100%;
  padding-bottom: 1rem;
`;

function ConfigureMetadata(props) {
  const {
    setError,
    setMetadataUrlValid,
  } = props;

  const [metadataUrl, setMetadataUrl] = useState('');
  const [profileName, setProfileName] = useState('');
  const [urlGroupClass, setUrlGroupClass] = useState('form-group');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        url,
        name,
      } = await window.electronAPI.getDefaultMetadata();
      setMetadataUrl(url);
      setProfileName(name);

      const dm = await window.electronAPI.getDarkMode();
      setDarkMode(dm);
    })();

    window.electronAPI.darkModeUpdated((event, value) => {
      setDarkMode(value);
    });
  }, []);

  const handleInputChange = ({ target: { name, value } }) => {
    switch (name) {
      case 'profileName':
        setProfileName(value);
        break;
      case 'metadataUrl':
        setMetadataUrl(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      metadataUrl,
      profileName,
    };

    const {
      error,
      redirect,
      metadataUrlValid,
    } = await window.electronAPI.login(payload);
    if (error) {
      setError(error);
      setMetadataUrlValid(metadataUrlValid);
      setUrlGroupClass('form-group has-error');
    }

    if (redirect) {
      document.location.replace(redirect);
    }
  };

  const handleKeyDown = (event) => event.keyCode === 13 && handleSubmit(event);

  return (
    <fieldset>
      <legend>Configure</legend>
      <div className={urlGroupClass}>
        <FullSizeLabel htmlFor="metadataUrl">
          SAML Metadata URL
          <Input
            className="form-control"
            id="metadataUrl"
            name="metadataUrl"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            pattern="https://.+"
            required
            type="url"
            value={metadataUrl}
          />
        </FullSizeLabel>
      </div>
      <div className="form-group">
        <FullSizeLabel htmlFor="profileName">
          Account Alias
          <Input
            className="form-control"
            id="profileName"
            name="profileName"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            pattern=".+"
            type="text"
            value={profileName}
          />
        </FullSizeLabel>
      </div>
      <Button
        color="primary"
        onClick={handleSubmit}
        outline={!darkMode}
      >
        Done
      </Button>
    </fieldset>
  );
}

ConfigureMetadata.propTypes = {
  setError: PropTypes.func.isRequired,
  setMetadataUrlValid: PropTypes.func.isRequired,
};

export default ConfigureMetadata;
