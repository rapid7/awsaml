import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {submitSelectRole} from '../../actions/select-role';
import {ListGroupItem} from 'reactstrap';
import styled from 'styled-components';


const SelectRoleButton = styled(ListGroupItem)`
  cursor: pointer;
`;

class RoleComponent extends Component {
  displayName = () => {
    if (this.props.displayAccountId) {
      return `${this.props.accountId}:${this.props.name}`;
    }

    return this.props.name;
  };

  static propTypes = {
    accountId: PropTypes.string,
    displayAccountId: PropTypes.bool,
    index: PropTypes.number,
    name: PropTypes.string,
    principalArn: PropTypes.string,
    roleArn: PropTypes.string,
    submitSelectRole: PropTypes.func.isRequired,
  };

  handleClick = (event) => {
    event.preventDefault();
    this.props.submitSelectRole({index: this.props.index});
  };

  render() {
    return (
      <SelectRoleButton
        action
        onClick={this.handleClick}
        tag="button"
      >
        {this.displayName()}
      </SelectRoleButton>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitSelectRole: bindActionCreators(submitSelectRole, dispatch),
});

export const Role = connect(null, mapDispatchToProps)(RoleComponent);
