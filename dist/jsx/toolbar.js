/** @jsx React.DOM */
(function(React, Classable, exports) {

  // var Classable = require('./mixins/classable.js');
  // var React = require('react');

  var Toolbar = React.createClass({displayName: "Toolbar",

    mixins: [Classable],

    render: function() {
      var classes = this.getClasses('mui-toolbar', {
      });

      return (
        React.createElement("div", {className: classes}, 
          this.props.children
        )
      );
    }

  });

  exports.Toolbar = Toolbar;

})(window.React, window.Classable, window);
