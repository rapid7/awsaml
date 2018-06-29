import {Component} from 'react';

export class ComponentWithTooltip extends Component {
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
}
