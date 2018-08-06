import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ListGroup,
  Input
} from 'reactstrap';
import {Login} from './Login';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

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

  return metadataUrls.filter((metadataUrl) =>
    tokens.every((token) =>
      metadataUrl.name.toLowerCase().indexOf(token) !== -1
        || metadataUrl.url.toLowerCase().indexOf(token) !== -1
    )
  );
};

class RecentLogins extends Component {
  static propTypes = {
    metadataUrls: PropTypes.array.isRequired,
  }

  state = {
    filterText: '',
  };

  handleFilterInputChange = ({currentTarget: {value: filterText}}) => this.setState({filterText});

  render() {
    const metadataUrls = filterMetadataUrls(this.props.metadataUrls, this.state.filterText);

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
    );
  }
}

export default RecentLogins;
