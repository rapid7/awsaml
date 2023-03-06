import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  InputGroup,
  Input,
  Tooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class InputGroupWithCopyButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipState: false,
    };
  }

  handleTooltipTargetClick = () => {
    const {
      tooltipState,
    } = this.state;
    const {
      value,
    } = this.props;

    this.setState({
      tooltipState: !tooltipState,
    });
    navigator.clipboard.writeText(value);

    setTimeout(function () { // eslint-disable-line prefer-arrow-callback, func-names
      this.setState({
        tooltipState,
      });
    }.bind(this), 1000);
  };

  render() {
    const {
      id: idFromProps,
      className,
      inputClassName,
      name,
      value,
      message,
      multiLine,
    } = this.props;
    const {
      tooltipState,
    } = this.state;
    const id = `icon-${idFromProps}`;

    return (
      <InputGroup className={className}>
        <Input
          className={`form-control ${inputClassName}`}
          id={name}
          name={name}
          disabled
          type={multiLine ? 'textarea' : 'text'}
          value={value}
        />
        <Button
          onClick={this.handleTooltipTargetClick}
          id={id}
          outline
          color="secondary"
        >
          <Tooltip
            autohide
            container="#root"
            isOpen={tooltipState}
            placement="top"
            target={id}
          >
            {message}
          </Tooltip>
          <FontAwesomeIcon icon={['far', 'copy']} inverted="true" />
        </Button>
      </InputGroup>
    );
  }
}

InputGroupWithCopyButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  inputClassName: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  multiLine: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

InputGroupWithCopyButton.defaultProps = {
  message: 'Copied!',
  multiLine: false,
};

export default InputGroupWithCopyButton;
