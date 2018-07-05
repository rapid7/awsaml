import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {submitConfigure} from '../../actions/configure';
import {Button} from 'reactstrap';
import {ComponentWithError} from '../components/ComponentWithError';
import './ConfigureMetadata.css';

class ConfigureMetadataComponent extends Component {
  state = {
    metadataUrl: ''
  };

  componentDidMount() {
    this.setState({
      metadataUrl: this.props.defaultMetadataUrl
    });
  }

  componentDidUpdate() {
    if (this.props.redirect) {
      window.location.href = this.props.redirect;
    }
  }

  handleInputChange = ({target: {name, value}}) => {
    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {metadataUrl} = this.state;
    const payload = {
      metadataUrl: metadataUrl
    };

    this.props.submitConfigure(payload);
  };

  handleKeyDown = (event) => {
    if (event.keyCode === 13) { // Enter key
      this.handleSubmit(event);
    }
  };

  render() {
    return (
      <fieldset>
        <legend>Configure</legend>
        {this.props.errorMessage}
        <div className={this.props.urlGroupClass}>
          <label htmlFor="metadataUrl">SAML Metadata URL</label>
          <input
            className="form-control"
            value={this.state.metadataUrl}
            id="metadataUrl"
            name="metadataUrl"
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            pattern="https://.+"
            required
            type="url"
          />
        </div>
        <Button outline color="primary" onClick={this.handleSubmit}>Done</Button>
      </fieldset>
    );
  }
}

const mapStateToProps = ({configure}, ownProps) => {
  return {
    ...configure.submitFailure,
    ...configure.submitSuccess,
    ...ownProps
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitConfigure: bindActionCreators(submitConfigure, dispatch)
  };
};

export const ConfigureMetadata = connect(mapStateToProps, mapDispatchToProps)(ComponentWithError(ConfigureMetadataComponent));
