
(function(React, Classable, ClickAwayable, KeyLine, Paper, Icon, Menu, MenuItem, exports) {
  
  // var React = require('react'),
  //   Classable = require('./mixins/classable.js'),
  //   ClickAwayable = require('./mixins/click-awayable'),
  //   KeyLine = require('./utils/key-line.js'),
  //   Paper = require('./paper.jsx'),
  //   Icon = require('./icon.jsx'),
  //   Menu = require('./menu.jsx'),
  //   MenuItem = require('./menu-item.jsx');

  var DropDownIcon = React.createClass({displayName: "DropDownIcon",

    mixins: [Classable, ClickAwayable],

    propTypes: {
      onChange: React.PropTypes.func,
      menuItems: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
      return {
        open: false
      }
    },

    componentClickAway: function() {
      this.setState({ open: false });
    },

    render: function() {
      var classes = this.getClasses('mui-drop-down-icon', {
        'mui-open': this.state.open
      });

      return (
        React.createElement("div", {className: classes}, 
            React.createElement("div", {className: "mui-menu-control", onClick: this._onControlClick}, 
                React.createElement(Icon, {icon: this.props.icon})
            ), 
            React.createElement(Menu, {ref: "menuItems", menuItems: this.props.menuItems, hideable: true, visible: this.state.open, onItemClick: this._onMenuItemClick})
          )
      );
    },

    _onControlClick: function(e) {
      this.setState({ open: !this.state.open });
    },

    _onMenuItemClick: function(e, key, payload) {
      if (this.props.onChange) this.props.onChange(e, key, payload);
      this.setState({ open: false });
    }

  });

  exports.DropDownIcon = DropDownIcon;

})(window.React, window.Classable, window.ClickAwayable, window.KeyLine, window.Paper, window.Icon, window.Menu, window.MenuItem, window);
