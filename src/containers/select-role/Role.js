import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'reactstrap';
import styled from 'styled-components';
import { submitSelectRole } from '../../actions/select-role';

const SelectRoleButton = styled(ListGroupItem)`
  cursor: pointer;
`;

const displayName = (displayAccountId, accountId, name) => (displayAccountId ? `${accountId}:${name}` : name);

class RoleComponent extends Component {
  handleClick = (event) => {
    event.preventDefault();
    const {
      submitSelectRole: ssr,
      index,
    } = this.props;
    ssr({ index });
  };

  render() {
    const {
      displayAccountId,
      accountId,
      name,
    } = this.props;

    return (
      <SelectRoleButton
        action
        onClick={this.handleClick}
        tag="button"
      >
        {displayName(displayAccountId, accountId, name)}
      </SelectRoleButton>
    );
  }
}

RoleComponent.propTypes = {
  accountId: PropTypes.string,
  displayAccountId: PropTypes.bool,
  index: PropTypes.number,
  name: PropTypes.string,
  submitSelectRole: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  submitSelectRole: bindActionCreators(submitSelectRole, dispatch),
});

export default connect(null, mapDispatchToProps)(RoleComponent);
