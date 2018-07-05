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
  state = {
    tooltipState: false,
  };

  static defaultProps = {
    message: 'Copied!',
    readOnly: true,
  };

  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    name: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
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
    const id = `icon-${this.props.id}`;

    return (
      <InputGroup className="mb-3 mt-3">
        <Input
          className="form-control"
          id={this.props.name}
          name={this.props.name}
          readOnly={this.props.readOnly}
          value={this.props.value}
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
            {this.props.message}
          </Tooltip>
          <Clipboard
            className="btn btn-outline-secondary copy-to-clipboard-button"
            data-clipboard-text={this.props.value}
          >
            <FontAwesomeIcon icon={['far', 'copy']}/>
          </Clipboard>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}
