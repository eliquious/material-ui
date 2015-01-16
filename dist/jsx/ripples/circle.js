(function(React, Classable, exports) {
  
  // var React = require('react');
  // var Classable = require('../mixins/classable');

  var RippleCircle = React.createClass({displayName: "RippleCircle",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      started: React.PropTypes.bool,
      ending: React.PropTypes.bool
    },

    render: function() {
      var {
        innerClassName,
        started,
        ending,
        ...other
      } = this.props;
      var classes = this.getClasses('mui-ripple-circle', {
        'mui-is-started': this.props.started,
        'mui-is-ending': this.props.ending
      });

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}), 
          React.createElement("div", {className: "mui-ripple-circle-inner"})
        )
      );
    }

  });

  exports.RippleCircle = RippleCircle;

})(window.React, window.Classable, window);
