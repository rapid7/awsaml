import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import {getOr} from 'unchanged';
import qs from 'querystring';
import styled from 'styled-components';
import {fetchConfigure} from '../../actions/configure';
import {
  Container,
  Row
} from 'reactstrap';
import {Logo} from '../components/Logo';
import RecentLogins from './RecentLogins';
import {ConfigureMetadata} from './ConfigureMetadata';
import {
  RoundedContent,
  RoundedWrapper
} from '../../constants/styles';

const CenteredDivColumn = styled.div`
  float: none;
  margin: 0 auto;
`;

const RoundedCenteredDivColumnContent = RoundedContent.extend(CenteredDivColumn);
const RoundedCenteredDivColumnWrapper = RoundedWrapper.extend(CenteredDivColumn);


class Configure extends Component {
  static propTypes = {
    defaultMetadataName: PropTypes.string,
    defaultMetadataUrl: PropTypes.string,
    fetchConfigure: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

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
    this._isMounted = true;

    await this.props.fetchConfigure();
    if (this._isMounted) {
      this.setState({
        loaded: true,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.auth) {
      return <Redirect to="/refresh" />;
    }
    if (this.state.selectRole) {
      return <Redirect to="/select-role" />;
    }
    const metadataUrls = getOr([], 'metadataUrls', this.props);

    return (this.state.loaded) ? (
      <Container>
        <Row>
          <RoundedCenteredDivColumnWrapper>
            <Logo />
            <RoundedCenteredDivColumnContent>
              <ConfigureMetadata 
                defaultMetadataName={this.props.defaultMetadataName}
                defaultMetadataUrl={this.props.defaultMetadataUrl}
              />
              {!!metadataUrls.length && <RecentLogins metadataUrls={metadataUrls} />}
            </RoundedCenteredDivColumnContent>
          </RoundedCenteredDivColumnWrapper>
        </Row>
      </Container>
    ) : '';
  }
}

const mapStateToProps = ({configure}) => ({
  ...configure.fetchFailure,
  ...configure.fetchSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchConfigure: bindActionCreators(fetchConfigure, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
