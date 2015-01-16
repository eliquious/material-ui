(function(React, Classable, TableRowsItem, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js'),
  //   TableRowsItem = require('./table-rows-item.jsx');

  var TableRow = React.createClass({displayName: "TableRow",

    mixins: [Classable],

    propTypes: {
      rowItems: React.PropTypes.array.isRequired
    },

    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      var classes = this.getClasses('mui-table-rows');

      return (
        React.createElement("div", {className: classes}, 
          this._getChildren()
        )
      );
    },

    _getChildren: function() {
      var children = [],
        rowItem,
        itemComponent

      for (var i=0; i < this.props.rowItems.length; i++) {
        rowItem = this.props.rowItems[i];

        /*
        for(var prop in rowItem) {
          if(rowItem.hasOwnProperty(prop)) {
            console.log(prop);
          }
        }
        console.log("--");
        */

        itemComponent = (
          React.createElement(TableRowsItem, null)
        );

        children.push(itemComponent);
      }

      return children;
    }

  });

  exports.TableRow = TableRow;

})(window.React, window.Classable, window.TableRowsItem, window);
