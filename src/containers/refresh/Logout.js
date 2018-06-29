import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import {Redirect} from 'react-router';
import {bindActionCreators} from 'redux';
import {fetchLogout} from '../../actions/logout';

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
      <Button color="danger" className="button-margin" onClick={this.handleLogoutEvent}>Logout</Button>
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
