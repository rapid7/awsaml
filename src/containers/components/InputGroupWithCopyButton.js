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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    name: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
    multiLine: PropTypes.bool,
  };

  static defaultProps = {
    message: 'Copied!',
    readOnly: true,
    multiLine: false,
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
    const {id: idFromProps, name, readOnly, value, message, multiLine} = this.props;
    const id = `icon-${idFromProps}`;

    return (
      <InputGroup className="mb-3 mt-3">
        <Input
          className="form-control"
          id={name}
          name={name}
          readOnly={readOnly}
          value={value}
          type={multiLine ? "textarea" : "text"}
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
            className="btn btn-outline-secondary copy-to-clipboard-button"
            data-clipboard-text={value}
          >
            <FontAwesomeIcon icon={['far', 'copy']}/>
          </Clipboard>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}
