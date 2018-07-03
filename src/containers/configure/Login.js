import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {submitConfigure} from '../../actions/configure';
import {deleteProfile} from '../../actions/profile';
import Clipboard from 'react-clipboard.js';
import {InputGroup, InputGroupAddon, Input, ListGroupItem, Button} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {ComponentWithTooltip} from '../components/ComponentWithTooltip';
import {CopyTooltip} from '../components/CopyTooltip';
import './Login.css';

class LoginComponent extends ComponentWithTooltip {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      profileName: '',
    };
  }

  handleInputChange = ({target: {name, value}}) => {
    this.setState({
      [name]: value
    });
  };

  handleKeyDown = (event) => {
    if (event.keyCode !== 32) { // Spacebar
      return;
    }
    event.preventDefault();
    event.currentTarget.value += ' ';
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {profileName} = this.state;
    const payload = {
      metadataUrl: this.props.url,
      profileName: (profileName) ? profileName : this.props.pretty
    };

    this.props.submitConfigure(payload);
  };

  handleDelete = (event) => {
    event.preventDefault();
    const payload = {
      profile: this.props.profileId
    };

    this.props.deleteProfile(payload);
  };

  render() {
    const id = `icon-${this.props.profileId}`;

    return (
      <ListGroupItem key={this.props.url}>
        <details>
          <summary>
            <InputGroup className="profile">
              <Input
                className="form-control"
                defaultValue={this.props.pretty}
                name="profileName"
                type="text"
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
              />
              <InputGroupAddon addonType="append">
                <Button outline color="secondary" onClick={this.handleSubmit}>Login</Button>
                <Button outline color="danger" onClick={this.handleDelete}>
                  <FontAwesomeIcon icon={['far', 'trash-alt']}/>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </summary>

          <br/>

          <InputGroup className="mb-3">
            <Input
              className="form-control"
              value={this.props.url}
              id={this.props.pretty}
              name={this.props.pretty}
              readOnly
              type="url"
            />
            <InputGroupAddon addonType="append" id={id} onClick={this.handleTooltipTargetClick}>
              <Clipboard className="btn btn-outline-secondary copy-to-clipboard-button" data-clipboard-text={this.props.url}>
                <FontAwesomeIcon icon={['far', 'copy']} />
              </Clipboard>
            </InputGroupAddon>
            <CopyTooltip state={this.state.tooltipState} target={id} />
          </InputGroup>
        </details>
      </ListGroupItem>
    );
  }
}

const mapStateToProps = ({profile}) => {
  return {
    ...profile.deleteFailure,
    deleted: profile.deleteSuccess
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitConfigure: bindActionCreators(submitConfigure, dispatch),
    deleteProfile: bindActionCreators(deleteProfile, dispatch)
  };
};

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
