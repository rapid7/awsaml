import React from 'react';
import {ListGroup} from 'reactstrap';
import {Login} from './Login';

export const RecentLogins = ({metadataUrls}) => {
  return(
    <div id="recent-logins">
      <h4>Recent Logins</h4>
      <ListGroup className="scrollable-list">
        {
          metadataUrls.map(({url, name}, i) => {
            return (
              <Login key={url} profileId={i} url={url} pretty={name} />
            );
          })
        }
      </ListGroup>
    </div>
  )
};
