import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Tooltip
} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Clipboard from 'react-clipboard.js';

export class InputGroupWithCopyButton extends Component {
  static propTypes = {
    buttonClassName: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    inputClassName: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    multiLine: PropTypes.bool,
    name: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
  };

  static defaultProps = {
    message: 'Copied!',
    multiLine: false,
    readOnly: true,
  };

  state = {
    tooltipState: false,
  };

  handleTooltipTargetClick = () => {
    this.setState({
      tooltipState: !this.state.tooltipState,
    });

    setTimeout(function() { // eslint-disable-line prefer-arrow-callback
      this.setState({
        tooltipState: !this.state.tooltipState,
      });
    }.bind(this), 1000);
  };

  render() {
    const {id: idFromProps, buttonClassName, className, inputClassName, name, readOnly, value, message, multiLine} = this.props;
    const id = `icon-${idFromProps}`;

    return (
      <InputGroup className={className}>
        <Input
          className={`form-control ${inputClassName}`}
          id={name}
          name={name}
          readOnly={readOnly}
          type={multiLine ? 'textarea' : 'text'}
          value={value}
        />
        <InputGroupAddon
          addonType="append"
          id={id}
          onClick={this.handleTooltipTargetClick}
        >
          <Tooltip
            container="#root"
            isOpen={this.state.tooltipState}
            placement="top"
            target={id}
          >
            {message}
          </Tooltip>
          <Clipboard
            className={`btn btn-outline-secondary copy-to-clipboard-button ${buttonClassName}`}
            data-clipboard-text={value}
          >
            <FontAwesomeIcon icon={['far', 'copy']}/>
          </Clipboard>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}
