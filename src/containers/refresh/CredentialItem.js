import React, {Component} from 'react';
import {InputGroup, Input, InputGroupAddon} from 'reactstrap';
import Clipboard from 'react-clipboard.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {WithToolTip} from '../components/ComponentWithTooltip';
import {CopyTooltip} from '../components/CopyTooltip';

class klass extends Component {
  render() {
    const {title, value} = this.props;
    const id = title.toLowerCase().split(' ').join('-');
    return (
      <div>
        <dt>{title}:</dt>
        <dd>
          <InputGroup className="mb-3">
            <Input
                className="form-control bg-light"
                value={value}
                id={id}
                readOnly
                type="text"
            />
            <InputGroupAddon addonType="append" id={`${id}-icon`} onClick={this.props.handleTooltipTargetClick}>
              <Clipboard
                  className="btn btn-outline-secondary copy-to-clipboard-button"
                  data-clipboard-target={`#${id}`}
              >
                <FontAwesomeIcon icon={['far', 'copy']} />
              </Clipboard>
            </InputGroupAddon>
            <CopyTooltip state={this.props.tooltipState} target={`${id}-icon`} />
          </InputGroup>
        </dd>
      </div>
    );
  }
}

export const CredentialItem = WithToolTip(klass);
