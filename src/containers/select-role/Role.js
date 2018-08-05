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
  static propTypes = {
    displayAccountId: PropTypes.bool,
    index: PropTypes.number,
    name: PropTypes.string,
    accountId: PropTypes.string,
    roleArn: PropTypes.string,
    principalArn: PropTypes.string,
    submitSelectRole: PropTypes.func.isRequired,
  };

  handleClick = (event) => {
    event.preventDefault();
    this.props.submitSelectRole({index: this.props.index});
  };

  displayName = () => {
    if (this.props.displayAccountId) {
      return this.props.accountId + ":" + this.props.name;
    } else {
      return this.props.name;
    }
  };

  render() {
    return (
      <SelectRoleButton tag="button" action onClick={this.handleClick}>
         {this.displayName()}
      </SelectRoleButton>
    );
  }
}

const mapStateToProps = ({state}) => ({
});

const mapDispatchToProps = (dispatch) => ({
  submitSelectRole: bindActionCreators(submitSelectRole, dispatch),
});

export const Role = connect(mapStateToProps, mapDispatchToProps)(RoleComponent);
