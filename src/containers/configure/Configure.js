import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router';
import {getOr} from 'unchanged';
import qs from 'querystring';
import {fetchConfigure, submitConfigure} from '../../actions/configure';
import {Container, Row} from 'reactstrap';
import {ComponentWithError} from '../components/ComponentWithError';
import {Logo} from '../components/Logo';
import {RecentLogins} from './RecentLogins';
import {ConfigureMetadata} from './ConfigureMetadata';
import './Configure.css';

class Configure extends ComponentWithError {
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
          <div className="col-centered rounded-6 wrapper">
            <Logo />
            <div className="col-centered rounded-6 content">
              <ConfigureMetadata defaultMetadataUrl={this.props.defaultMetadataUrl} />
              {!!metadataUrls.length && <RecentLogins metadataUrls={metadataUrls} />}
            </div>
          </div>
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
    fetchConfigure: bindActionCreators(fetchConfigure, dispatch),
    submitConfigure: bindActionCreators(submitConfigure, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Configure);
