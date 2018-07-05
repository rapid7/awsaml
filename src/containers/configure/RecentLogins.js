import React from 'react';
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

export const RecentLogins = ({metadataUrls}) => {
  return(
    <div id="recent-logins">
      <RecentLoginsHeader>Recent Logins</RecentLoginsHeader>
      <ScrollableListGroup>
        {
          metadataUrls.map(({url, name}, i) => {
            return (
              <Login key={url} profileId={i} url={url} pretty={name} />
            );
          })
        }
      </ScrollableListGroup>
    </div>
  )
};
