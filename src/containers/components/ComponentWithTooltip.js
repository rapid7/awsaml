import React, {Component} from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export const WithToolTip = (WrappedComponent) => {
  class ComponentWithTooltip extends Component {
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

    render() {
      return <WrappedComponent
        {...this.props}
        {...this.state}
        handleTooltipTargetClick={this.handleTooltipTargetClick}/>;
    }
  }

  hoistNonReactStatic(ComponentWithTooltip, WrappedComponent);

  return ComponentWithTooltip;
};
