import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {InputGroup, Input, InputGroupAddon, Tooltip} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Clipboard from 'react-clipboard.js';

export class InputGroupWithCopyButton extends Component {
  static defaultProps = {
    readOnly: true,
    message: 'Copied!'
  };

  state = {
    tooltipState: false
  };

  handleTooltipTargetClick = () => {
    this.setState({
      tooltipState: !this.state.tooltipState
    });

    setTimeout(function () {
      this.setState({
        tooltipState: !this.state.tooltipState
      });
    }.bind(this), 1000);
  };

  render () {
    const id = `icon-${this.props.id}`;

    return (
      <InputGroup className="mb-3 mt-3">
        <Input
          className="form-control"
          defaultValue={this.props.value}
          id={this.props.name}
          name={this.props.name}
          readOnly={this.props.readOnly}
        />

        <InputGroupAddon addonType="append" id={id} onClick={this.handleTooltipTargetClick}>
          <Tooltip container="#root" placement="top" isOpen={this.state.tooltipState} target={id}>
            {this.props.message}
          </Tooltip>
          <Clipboard className="btn btn-outline-secondary copy-to-clipboard-button" data-clipboard-text={this.props.value}>
            <FontAwesomeIcon icon={['far', 'copy']}/>
          </Clipboard>
        </InputGroupAddon>
      </InputGroup>
    )
  }
}

InputGroupWithCopyButton.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  readOnly: PropTypes.bool,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};
