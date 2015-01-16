(function(React, Classable, EnhancedButton, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable.js');
  // var EnhancedButton = require('./enhanced-button.jsx');

  var FlatButton = React.createClass({displayName: "FlatButton",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      label: React.PropTypes.string.isRequired,
      primary: React.PropTypes.bool,
      secondary: React.PropTypes.bool
    },

    render: function() {
      var {
          label,
          primary,
          secondary,
          ...other
        } = this.props;
      var classes = this.getClasses('mui-flat-button', {
        'mui-is-primary': primary,
        'mui-is-secondary': !primary && secondary
      });

      return (
        React.createElement(EnhancedButton, React.__spread({},  other, 
          {className: classes}), 
          React.createElement("span", {className: "mui-flat-button-label"}, label)
        )
      );
    }

  });

  exports.FlatButton = FlatButton;

})(window.React, window.Classable, window.EnhancedButton, window);
