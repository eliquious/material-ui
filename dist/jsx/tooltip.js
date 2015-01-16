(function(React, Classable, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable.js');

  var Tooltip = React.createClass({displayName: "Tooltip",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      label: React.PropTypes.string.isRequired,
      show: React.PropTypes.bool,
      touch: React.PropTypes.bool
    },

    componentDidMount: function() {
      this._setRippleSize();
    },

    componentDidUpdate: function(prevProps, prevState) {
      this._setRippleSize();
    },

    render: function() {
      var {
        className,
        label,
        ...other } = this.props;
      var classes = this.getClasses('mui-tooltip', {
        'mui-is-shown': this.props.show,
        'mui-is-touch': this.props.touch
      });

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}), 
          React.createElement("div", {ref: "ripple", className: "mui-tooltip-ripple"}), 
          React.createElement("span", {className: "mui-tooltip-label"}, this.props.label)
        )
      );
    },

    _setRippleSize: function() {
      var ripple = this.refs.ripple.getDOMNode();
      var tooltipSize = this.getDOMNode().offsetWidth;
      var ripplePadding = this.props.touch ? 45 : 20;
      var rippleSize = tooltipSize + ripplePadding + 'px';

      if (this.props.show) {
        ripple.style.height = rippleSize;
        ripple.style.width = rippleSize;
      } else {
        ripple.style.width = '0px';
        ripple.style.height = '0px';
      }
    }

  });

  exports.Tooltip = Tooltip;

})(window.React, window.Classable, window);
