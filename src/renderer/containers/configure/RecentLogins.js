import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Input,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoginList from './LoginList';

const RecentLoginsHeader = styled.h4`
  border-top: 2px solid rgb(203, 203, 203);
  margin-top: 15px;
  padding-top: 15px;
`;

const SearchContainer = styled.div`
  position: absolute;
  right: 0;
  top: 10px;
  width: 250px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 11px;
  left: 10px;
`;

const SearchInput = styled(Input)`
  padding-left: 30px;
`;

const filterMetadataUrls = (metadataUrls, filterText) => {
  if (!filterText) {
    return metadataUrls;
  }

  const tokens = filterText.split(' ').map((token) => token.toLowerCase());

  return metadataUrls.filter((metadataUrl) => (tokens.every((token) => {
    // Compare profile name
    if (metadataUrl.name.toLowerCase().indexOf(token) !== -1) {
      return true;
    }

    // Compare profile URL
    if (metadataUrl.url.toLowerCase().indexOf(token) !== -1) {
      return true;
    }

    // Compare profile roles
    return (metadataUrl.roles || []).some((role) => role.toLowerCase().indexOf(token) !== -1);
  })
  ));
};

function RecentLogins(props) {
  const {
    errorHandler,
  } = props;

  const [filterText, setFilterText] = useState('');
  const [metadataUrls, setMetadataUrls] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const mdUrls = await window.electronAPI.getMetadataUrls();
      setMetadataUrls(mdUrls);

      const dm = await window.electronAPI.getDarkMode();
      setDarkMode(dm);
    })();

    window.electronAPI.darkModeUpdated((event, value) => {
      setDarkMode(value);
    });

    return () => {};
  }, []);

  // eslint-disable-next-line max-len
  const handleFilterInputChange = ({ currentTarget: { value: ft } }) => setFilterText(ft);

  const deleteCallback = useCallback((deleted) => {
    const updatedMetadataUrls = metadataUrls
      .filter((metadataUrl) => metadataUrl.profileUuid !== deleted.profileUuid);
    setMetadataUrls(updatedMetadataUrls);
  }, [metadataUrls]);

  const reorderCallback = useCallback((updatedMetadataUrls) => {
    setMetadataUrls(updatedMetadataUrls);
    window.electronAPI.setMetadataUrls(updatedMetadataUrls);
  }, []);

  const filteredMetadataUrls = filterMetadataUrls(metadataUrls, filterText);

  return (
    <div
      className="position-relative"
      id="recent-logins"
    >
      <RecentLoginsHeader>Recent Logins</RecentLoginsHeader>
      <SearchContainer>
        <SearchInput onChange={handleFilterInputChange} />
        <SearchIcon
          color="grey"
          icon={['fas', 'search']}
        />
      </SearchContainer>
      <DndProvider backend={HTML5Backend}>
        <LoginList
          filteredMetadataUrls={filteredMetadataUrls || []}
          deleteCallback={deleteCallback}
          reOrderCallback={reorderCallback}
          errorHandler={errorHandler}
          darkMode={darkMode}
        />
      </DndProvider>
    </div>
  );
}

RecentLogins.propTypes = {
  errorHandler: PropTypes.func.isRequired,
};

export default RecentLogins;
