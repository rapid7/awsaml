import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import {Redirect} from 'react-router';
import styled from 'styled-components';
import {bindActionCreators} from 'redux';
import {fetchLogout} from '../../actions/logout';
import {BUTTON_MARGIN} from '../../constants/styles';

const ButtonWithMargin = styled(Button)`${BUTTON_MARGIN}`;

class LogoutComponent extends Component {
  handleLogoutEvent = (event) => {
    event.preventDefault();

    this.props.fetchLogout();
  };

  render() {
    if (this.props.logout) {
      return <Redirect to='/' />
    }

    return (
      <ButtonWithMargin color="danger" onClick={this.handleLogoutEvent}>Logout</ButtonWithMargin>
    );
  }
}

const mapStateToProps = ({logout}) => {
  return {
    ...logout.fetchFailure,
    ...logout.fetchSuccess
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLogout: bindActionCreators(fetchLogout, dispatch)
  }
};

export const Logout = connect(mapStateToProps, mapDispatchToProps)(LogoutComponent);
