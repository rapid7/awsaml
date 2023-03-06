import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
} from 'reactstrap';
import styled from 'styled-components';
import { submitConfigure } from '../../actions/configure';
import ComponentWithError from '../components/ComponentWithError';

const FullSizeLabel = styled.label`
  width: 100%;
  padding-bottom: 1rem;
`;

class ConfigureMetadataComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      metadataUrl: '',
      profileName: '',
    };
  }

  componentDidMount() {
    const {
      defaultMetadataUrl,
      defaultMetadataName,
    } = this.props;

    this.setState({
      metadataUrl: defaultMetadataUrl,
      profileName: defaultMetadataName,
    });
  }

  componentDidUpdate() {
    const {
      redirect,
    } = this.props;

    if (redirect) {
      document.location.replace(redirect);
    }
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      metadataUrl,
      profileName,
    } = this.state;
    const {
      submitConfigure: sc,
    } = this.props;

    const payload = {
      metadataUrl,
      profileName,
    };

    sc(payload);
  };

  handleKeyDown = (event) => event.keyCode === 13 && this.handleSubmit(event);

  render() {
    const {
      errorMessage,
      urlGroupClass,
      nameGroupClass,
    } = this.props;
    const {
      metadataUrl,
      profileName,
    } = this.state;

    return (
      <fieldset>
        <legend>Configure</legend>
        {errorMessage}
        <div className={urlGroupClass}>
          <FullSizeLabel htmlFor="metadataUrl">
            SAML Metadata URL
            <Input
              className="form-control"
              id="metadataUrl"
              name="metadataUrl"
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              pattern="https://.+"
              required
              type="url"
              value={metadataUrl}
            />
          </FullSizeLabel>
        </div>
        <div className={nameGroupClass}>
          <FullSizeLabel htmlFor="profileName">
            Account Alias
            <Input
              className="form-control"
              id="profileName"
              name="profileName"
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              pattern=".+"
              type="string"
              value={profileName}
            />
          </FullSizeLabel>
        </div>
        <Button
          color="primary"
          onClick={this.handleSubmit}
          outline
        >
          Done
        </Button>
      </fieldset>
    );
  }
}

ConfigureMetadataComponent.propTypes = {
  defaultMetadataName: PropTypes.string,
  defaultMetadataUrl: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  nameGroupClass: PropTypes.string,
  redirect: PropTypes.string,
  submitConfigure: PropTypes.func.isRequired,
  urlGroupClass: PropTypes.string,
};

const mapStateToProps = ({ configure }, ownProps) => ({
  ...configure.submitFailure,
  ...configure.submitSuccess,
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({
  submitConfigure: bindActionCreators(submitConfigure, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentWithError(ConfigureMetadataComponent));
