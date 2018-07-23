import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {ListGroup} from 'reactstrap';
import {Login} from './Login';

const ScrollableListGroup = styled(ListGroup)`
  overflow-x: hidden;
  height: 300px;
`;

const RecentLoginsHeader = styled.h4`
  border-top: 2px solid rgb(203, 203, 203);
  margin-top: 15px;
  padding-top: 15px;
`;

export const RecentLogins = (({metadataUrls}) =>
  (
    <div id="recent-logins">
      <RecentLoginsHeader>Recent Logins</RecentLoginsHeader>
      <ScrollableListGroup>
        {
          metadataUrls.map(({url, name}, i) =>
            (
              <Login
                key={url}
                pretty={name}
                profileId={i}
                url={url}
              />
            )
          )
        }
      </ScrollableListGroup>
    </div>
  )
);

RecentLogins.propTypes = {
  metadataUrls: PropTypes.array.isRequired,
};
