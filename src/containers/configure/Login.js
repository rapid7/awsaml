import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {submitConfigure} from '../../actions/configure';
import {deleteProfile} from '../../actions/profile';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  ListGroupItem,
  Button
} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {InputGroupWithCopyButton} from '../components/InputGroupWithCopyButton';

const ProfileInputGroup = styled(InputGroup)`
  width: 100%;
  height: 2.5em;
  line-height: 2.5em;
`;

class LoginComponent extends Component {
  state = {
    profileName: '',
  };

  static propTypes = {
    deleteProfile: PropTypes.func.isRequired,
    pretty: PropTypes.string,
    profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    submitConfigure: PropTypes.func.isRequired,
    url: PropTypes.string,
  };

  handleInputChange = ({target: {name, value}}) => {
    this.setState({
      [name]: value,
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
      profileName: (profileName) ? profileName : this.props.pretty,
    };

    this.props.submitConfigure(payload);
  };

  handleDelete = (event) => {
    event.preventDefault();
    const payload = {
      profile: this.props.profileId,
    };

    this.props.deleteProfile(payload);
  };

  render() {
    return (
      <ListGroupItem key={this.props.url}>
        <details>
          <summary>
            <ProfileInputGroup>
              <Input
                className="form-control"
                defaultValue={this.props.pretty}
                name="profileName"
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                type="text"
              />
              <InputGroupAddon addonType="append">
                <Button
                  color="secondary"
                  onClick={this.handleSubmit}
                  outline
                >
                  Login
                </Button>
                <Button
                  color="danger"
                  onClick={this.handleDelete}
                  outline
                >
                  <FontAwesomeIcon icon={['far', 'trash-alt']}/>
                </Button>
              </InputGroupAddon>
            </ProfileInputGroup>
          </summary>
          <InputGroupWithCopyButton
            id={this.props.profileId}
            name={this.props.pretty}
            value={this.props.url}
          />
        </details>
      </ListGroupItem>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  ...profile.deleteFailure,
  deleted: profile.deleteSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  deleteProfile: bindActionCreators(deleteProfile, dispatch),
  submitConfigure: bindActionCreators(submitConfigure, dispatch),
});

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
