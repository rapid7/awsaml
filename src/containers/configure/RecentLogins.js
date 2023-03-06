import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ListGroup,
  Input,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Login from './Login';

const ScrollableListGroup = styled(ListGroup)`
  overflow-x: hidden;
  height: 300px;
`;

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
    if ((metadataUrl.roles || []).some((role) => role.toLowerCase().indexOf(token) !== -1)) {
      return true;
    }

    return false;
  })
  ));
};

class RecentLogins extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterText: '',
    };
  }

  // eslint-disable-next-line max-len
  handleFilterInputChange = ({ currentTarget: { value: filterText } }) => this.setState({ filterText });

  render() {
    const {
      metadataUrls: metadataUrlsFromProps,
    } = this.props;
    const {
      filterText,
    } = this.state;

    const metadataUrls = filterMetadataUrls(metadataUrlsFromProps, filterText);

    return (
      <div
        className="position-relative"
        id="recent-logins"
      >
        <RecentLoginsHeader>Recent Logins</RecentLoginsHeader>
        <SearchContainer>
          <SearchInput onChange={this.handleFilterInputChange} />
          <SearchIcon
            color="grey"
            icon={['fas', 'search']}
          />
        </SearchContainer>
        <ScrollableListGroup>
          {
            metadataUrls.map(({ url, name, profileUuid }) => (
              <Login
                key={url}
                pretty={name}
                profileUuid={profileUuid}
                url={url}
              />
            ))
          }
        </ScrollableListGroup>
      </div>
    );
  }
}

RecentLogins.propTypes = {
  metadataUrls: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    profileUuid: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    url: PropTypes.string,
  })).isRequired,
};

export default RecentLogins;
