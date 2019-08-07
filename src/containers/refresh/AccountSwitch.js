import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

class AccountSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  static propTypes = {
    accounts: PropTypes.array,
    profileName: PropTypes.string,
    submitConfigure: PropTypes.func,
  }

  handleConfigureClickEvent = (account) => (event) => {
    event.preventDefault();

    const payload = {
      metadataUrl: account.url,
      profileName: account.name,
      profileUuid: account.profileUuid,
    };

    this.props.submitConfigure(payload);
  };

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  render() {
    const accounts = this.props.accounts;
    const profileName = this.props.profileName;

    return (
      <ButtonDropdown
        isOpen={this.state.dropdownOpen}
        toggle={this.toggle}
      >
        <DropdownToggle caret>
          {profileName}
        </DropdownToggle>
        <DropdownMenu>
          {
            accounts.map((account) => (
              <DropdownItem
                key={account.id}
                onClick={this.handleConfigureClickEvent(account)}
                role="button"
              >{account.name}
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default AccountSwitch;
