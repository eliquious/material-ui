(function(React, Classable, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js');

  var Overlay = React.createClass({displayName: "Overlay",

    mixins: [Classable],

    propTypes: {
      show: React.PropTypes.bool
    },

    render: function() {
      var 
        {
          className,
          ...other
        } = this.props,
        classes = this.getClasses('mui-overlay', {
          'mui-is-shown': this.props.show
        });

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}))
      );
    }

  });

  exports.Overlay = Overlay;

})(window.React, window.Classable, window);
