import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {Redirect} from 'react-router';
import styled from 'styled-components';
import {bindActionCreators} from 'redux';
import {fetchLogout} from '../../actions/logout';
import {BUTTON_MARGIN} from '../../constants/styles';

const ButtonWithMargin = styled(Button)`${BUTTON_MARGIN}`;

class LogoutComponent extends Component {
  static propTypes = {
    fetchLogout: PropTypes.func,
    logout: PropTypes.bool,
  };

  handleLogoutEvent = (event) => {
    event.preventDefault();

    this.props.fetchLogout();
  };

  render() {
    if (this.props.logout) {
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

const mapStateToProps = ({logout}) => ({
  ...logout.fetchFailure,
  ...logout.fetchSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLogout: bindActionCreators(fetchLogout, dispatch),
});

export const Logout = connect(mapStateToProps, mapDispatchToProps)(LogoutComponent);
