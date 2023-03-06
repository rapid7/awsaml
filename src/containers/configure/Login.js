import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  InputGroup,
  Input,
  ListGroupItem,
  Button,
  Collapse,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { submitConfigure } from '../../actions/configure';
import { deleteProfile } from '../../actions/profile';
import InputGroupWithCopyButton from '../components/InputGroupWithCopyButton';

const ProfileInputGroup = styled(InputGroup)`
  width: 100%;
  height: 2.5em;
  line-height: 2.5em;
`;

const PaddedCollapse = styled(Collapse)`
  margin-top: 0.4rem;
`;

class LoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileName: '',
      isOpen: false,
      caretDirection: 'right',
    };
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  // eslint-disable-next-line class-methods-use-this
  handleKeyDown = (event) => {
    if (event.keyCode !== 32) { // Spacebar
      return;
    }
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.currentTarget.value += ' ';
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      profileName,
    } = this.state;
    const {
      url,
      pretty,
      profileUuid,
      submitConfigure: sc,
    } = this.props;
    const payload = {
      metadataUrl: url,
      profileName: profileName || pretty,
      profileUuid,
    };

    sc(payload);
  };

  handleDelete = (event) => {
    event.preventDefault();
    const {
      profileName,
    } = this.state;
    const {
      pretty,
      profileUuid,
      deleteProfile: dp,
    } = this.props;

    const text = `Are you sure you want to delete the profile "${profileName || pretty}"?`;

    // eslint-disable-next-line no-alert
    if (window.confirm(text)) {
      const payload = { profileUuid };

      dp(payload);
    }
  };

  handleCollapse = () => {
    const {
      isOpen,
      caretDirection,
    } = this.state;
    const newCaretDirection = caretDirection === 'right' ? 'down' : 'right';

    this.setState({
      isOpen: !isOpen,
      caretDirection: newCaretDirection,
    });
  };

  render() {
    const {
      url,
      pretty,
      profileUuid,
    } = this.props;
    const {
      isOpen,
      caretDirection,
    } = this.state;

    return (
      <ListGroupItem key={url}>
        <ProfileInputGroup>
          <Button
            onClick={this.handleCollapse}
            outline
          >
            <FontAwesomeIcon icon={['fas', `fa-caret-${caretDirection}`]} />
          </Button>
          <Input
            className="form-control"
            defaultValue={pretty}
            name="profileName"
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            type="text"
          />
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
            <FontAwesomeIcon icon={['far', 'trash-alt']} />
          </Button>
        </ProfileInputGroup>
        <PaddedCollapse isOpen={isOpen}>
          <InputGroupWithCopyButton
            id={profileUuid}
            name={pretty}
            value={url}
          />
        </PaddedCollapse>
      </ListGroupItem>
    );
  }
}

LoginComponent.propTypes = {
  deleteProfile: PropTypes.func.isRequired,
  pretty: PropTypes.string,
  profileUuid: PropTypes.string,
  submitConfigure: PropTypes.func.isRequired,
  url: PropTypes.string,
};

const mapStateToProps = ({ profile }) => ({
  ...profile.deleteFailure,
  deleted: profile.deleteSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  deleteProfile: bindActionCreators(deleteProfile, dispatch),
  submitConfigure: bindActionCreators(submitConfigure, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
