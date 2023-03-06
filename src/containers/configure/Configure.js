import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { getOr } from 'unchanged';
import qs from 'querystring';
import styled from 'styled-components';
import {
  Container,
  Row,
} from 'reactstrap';
import { fetchConfigure } from '../../actions/configure';
import Logo from '../components/Logo';
import RecentLogins from './RecentLogins';
import ConfigureMetadata from './ConfigureMetadata';
import {
  RoundedContent,
  RoundedWrapper,
} from '../../constants/styles';

const CenteredDivColumn = styled.div`
  float: none;
  margin: 0 auto;
`;

const RoundedCenteredDivColumnContent = RoundedContent.extend(CenteredDivColumn);
const RoundedCenteredDivColumnWrapper = RoundedWrapper.extend(CenteredDivColumn);

class Configure extends Component {
  constructor(props) {
    super(props);

    const params = qs.parse(props.location.search);

    this.state = {
      auth: (params['?auth'] && params['?auth'] === 'true'),
      loaded: false,
      selectRole: (params['?select-role'] && params['?select-role'] === 'true'),
    };
  }

  async componentDidMount() {
    this._isMounted = true; // eslint-disable-line no-underscore-dangle

    const {
      fetchConfigure: fc,
    } = this.props;

    await fc();
    if (this._isMounted) { // eslint-disable-line no-underscore-dangle
      this.setState({
        loaded: true,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false; // eslint-disable-line no-underscore-dangle
  }

  render() {
    const {
      auth,
      selectRole,
      loaded,
    } = this.state;
    const {
      defaultMetadataName,
      defaultMetadataUrl,
    } = this.props;

    if (auth) {
      return <Redirect to="/refresh" />;
    }
    if (selectRole) {
      return <Redirect to="/select-role" />;
    }
    const metadataUrls = getOr([], 'metadataUrls', this.props);

    return (loaded) ? (
      <Container>
        <Row>
          <RoundedCenteredDivColumnWrapper>
            <Logo />
            <RoundedCenteredDivColumnContent>
              <ConfigureMetadata
                defaultMetadataName={defaultMetadataName}
                defaultMetadataUrl={defaultMetadataUrl}
              />
              {!!metadataUrls.length && <RecentLogins metadataUrls={metadataUrls} />}
            </RoundedCenteredDivColumnContent>
          </RoundedCenteredDivColumnWrapper>
        </Row>
      </Container>
    ) : '';
  }
}

Configure.propTypes = {
  defaultMetadataName: PropTypes.string,
  defaultMetadataUrl: PropTypes.string,
  fetchConfigure: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = ({ configure }) => ({
  ...configure.fetchFailure,
  ...configure.fetchSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchConfigure: bindActionCreators(fetchConfigure, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
