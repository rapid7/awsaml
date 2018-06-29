import React from 'react';
import {ListGroup} from 'reactstrap';
import {Login} from './Login';

export const RecentLogins = ({metadataUrls}) => {
  return(
    <div id="recent-logins">
      <h4>Recent Logins</h4>
      <ListGroup className="scrollable-list">
        {
          metadataUrls.map((metadataUrl, i) => {
            return (
              <Login key={i} profileId={i} url={metadataUrl.url} pretty={metadataUrl.name} />
            );
          })
        }
      </ListGroup>
    </div>
  )
};
