import React from 'react';
import {Tooltip} from 'reactstrap';

export const CopyTooltip = ({state, target}) => {
  return (
      <Tooltip container="#root" placement="top" isOpen={state} target={target}>
        Copied!
      </Tooltip>
  );
};
