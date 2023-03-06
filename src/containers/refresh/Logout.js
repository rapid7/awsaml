import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { fetchLogout } from '../../actions/logout';
import { BUTTON_MARGIN } from '../../constants/styles';

const ButtonWithMargin = styled(Button)`${BUTTON_MARGIN}`;

class LogoutComponent extends Component {
  handleLogoutEvent = (event) => {
    const {
      fetchLogout: fl,
    } = this.props;

    event.preventDefault();

    fl();
  };

  render() {
    const {
      logout,
    } = this.props;

    if (logout) {
      return <Redirect to="/" />;
    }

    return (
      <ButtonWithMargin
        color="danger"
        onClick={this.handleLogoutEvent}
      >
        Logout
      </ButtonWithMargin>
    );
  }
}

LogoutComponent.propTypes = {
  fetchLogout: PropTypes.func,
  logout: PropTypes.bool,
};

const mapStateToProps = ({ logout }) => ({
  ...logout.fetchFailure,
  ...logout.fetchSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLogout: bindActionCreators(fetchLogout, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutComponent);
