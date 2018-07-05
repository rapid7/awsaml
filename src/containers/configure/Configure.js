import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router';
import {getOr} from 'unchanged';
import qs from 'querystring';
import styled from 'styled-components';
import {fetchConfigure} from '../../actions/configure';
import {Container, Row} from 'reactstrap';
import {Logo} from '../components/Logo';
import {RecentLogins} from './RecentLogins';
import {ConfigureMetadata} from './ConfigureMetadata';

const CenteredDivColumn = styled.div`
  float: none;
  margin: 0 auto;
`;

class Configure extends Component {
  constructor(props) {
    super(props);

    const params = qs.parse(props.location.search);

    this.state = {
      auth: (params['?auth'] && params['?auth'] === 'true'),
      loaded: false
    };
  }

  async componentDidMount() {
    this._isMounted = true;

    await this.props.fetchConfigure();
    if (this._isMounted) {
      this.setState({
        loaded: true
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.auth) {
      return <Redirect to='/refresh' />
    }
    const metadataUrls = getOr([], 'metadataUrls', this.props);
    return (this.state.loaded) ? (
      <Container>
        <Row>
          <CenteredDivColumn className="rounded-6 wrapper">
            <Logo />
            <CenteredDivColumn className="rounded-6 content">
              <ConfigureMetadata defaultMetadataUrl={this.props.defaultMetadataUrl} />
              {!!metadataUrls.length && <RecentLogins metadataUrls={metadataUrls} />}
            </CenteredDivColumn>
          </CenteredDivColumn>
        </Row>
      </Container>
    ) : '';
  }
}

const mapStateToProps = ({configure}) => {
  return {
    ...configure.fetchFailure,
    ...configure.fetchSuccess
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchConfigure: bindActionCreators(fetchConfigure, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
