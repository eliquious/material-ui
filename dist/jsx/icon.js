(function(React, Classable, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js');

  var Icon = React.createClass({displayName: "Icon",

    mixins: [Classable],

    propTypes: {
      icon: React.PropTypes.string
    },

    render: function() {
      var { className, icon, ...other } = this.props,
        isMuiCustomIcon = icon.indexOf('mui-icon') > -1,
        mdfiClassName = 'mdfi_' + icon.replace(/-/g, '_'),
        iconClassName = isMuiCustomIcon ? icon : mdfiClassName,
        classes = this.getClasses('mui-icon ' + iconClassName);

      return (
        React.createElement("span", React.__spread({},  other, {className: classes}))
      );
    }

  });

  exports.Icon = Icon;

})(window.React, window.Classable, window);
