import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup } from 'reactstrap';
import update from 'immutability-helper';

import Login from './Login';

const ScrollableListGroup = styled(ListGroup)`
  overflow-x: hidden;
  height: 300px;
`;

function LoginList(props) {
  const {
    filteredMetadataUrls,
    deleteCallback,
    reOrderCallback,
    errorHandler,
    darkMode,
  } = props;

  const moveLogin = useCallback((dragIndex, hoverIndex) => {
    if (dragIndex === undefined) {
      return;
    }

    const updatedMetadataUrls = update(filteredMetadataUrls, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, filteredMetadataUrls[dragIndex]],
      ],
    });

    reOrderCallback(updatedMetadataUrls);
  }, [filteredMetadataUrls]);

  return (
    <ScrollableListGroup>
      {filteredMetadataUrls.map(({ url, name, profileUuid }, index) => (
        <Login
          index={index}
          moveLogin={moveLogin}
          deleteCallback={deleteCallback}
          errorHandler={errorHandler}
          key={url}
          pretty={name}
          profileUuid={profileUuid}
          url={url}
          darkMode={darkMode}
        />
      ))}
    </ScrollableListGroup>
  );
}

LoginList.propTypes = {
  filteredMetadataUrls: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profileUuid: PropTypes.string.isRequired,
  })).isRequired,
  deleteCallback: PropTypes.func.isRequired,
  reOrderCallback: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default LoginList;
