(function(React, Classable, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js');

  var TableRowItem = React.createClass({displayName: "TableRowItem",

    mixins: [Classable],

    propTypes: {
    },

    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      var classes = this.getClasses('mui-table-rows-item');

      return (
        React.createElement("div", {className: classes}, 
          "(TableRowItem)", 
          React.createElement("div", {className: "mui-table-rows-actions"}, 
            "(Actions)"
          )
        )
      );
    }

  });

  exports.TableRowItem = TableRowItem;
  
})(window.React, window.Classable, window);
