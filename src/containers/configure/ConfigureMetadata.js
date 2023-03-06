import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
} from 'reactstrap';
import styled from 'styled-components';
import { postConfigure } from '../../apis';
import ComponentWithError from '../components/ComponentWithError';

const FullSizeLabel = styled.label`
  width: 100%;
  padding-bottom: 1rem;
`;

function ConfigureMetadata(props) {
  const {
    defaultMetadataUrl,
    defaultMetadataName,
    errorMessage,
    urlGroupClass,
    nameGroupClass,
  } = props;

  const [metadataUrl, setMetadataUrl] = useState(defaultMetadataUrl);
  const [profileName, setProfileName] = useState(defaultMetadataName);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      metadataUrl,
      profileName,
    };

    postConfigure(payload).then(({ redirect }) => {
      if (redirect) {
        document.location.replace(redirect);
      }
    }).catch(console.error);
  };

  const handleKeyDown = (event) => event.keyCode === 13 && handleSubmit(event);

  return (
    <fieldset>
      <legend>Configure</legend>
      {errorMessage}
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
      <div className={nameGroupClass}>
        <FullSizeLabel htmlFor="profileName">
          Account Alias
          <Input
            className="form-control"
            id="profileName"
            name="profileName"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            pattern=".+"
            type="string"
            value={profileName}
          />
        </FullSizeLabel>
      </div>
      <Button
        color="primary"
        onClick={handleSubmit}
        outline
      >
        Done
      </Button>
    </fieldset>
  );
}

ConfigureMetadata.propTypes = {
  defaultMetadataName: PropTypes.string,
  defaultMetadataUrl: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  nameGroupClass: PropTypes.string,
  urlGroupClass: PropTypes.string,
};

ConfigureMetadata.defaultProps = {
  defaultMetadataName: '',
  errorMessage: '',
  nameGroupClass: '',
  urlGroupClass: '',
};

export default ComponentWithError(ConfigureMetadata);
