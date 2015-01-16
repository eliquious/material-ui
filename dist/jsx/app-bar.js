(function(React, Classable, IconButton, Paper, exports) {

  var AppBar = React.createClass({displayName: "AppBar",

    mixins: [Classable],

    propTypes: {
      onMenuIconButtonTouchTap: React.PropTypes.func,
      showMenuIconButton: React.PropTypes.bool,
      title : React.PropTypes.string,
      zDepth: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        showMenuIconButton: true,
        title: '',
        zDepth: 1
      }
    },

    render: function() {
      var classes = this.getClasses('mui-app-bar'),
        title, menuIconButton;

      if (this.props.title) {
        title = React.createElement("h1", {className: "mui-app-bar-title"}, this.props.title);
      }

      if (this.props.showMenuIconButton) {
        menuIconButton = (
          React.createElement(IconButton, {
            className: "mui-app-bar-navigation-icon-button", 
            icon: "navigation-menu", 
            onTouchTap: this._onMenuIconButtonTouchTap}
          )
        );
      }

      return (
        React.createElement(Paper, {rounded: false, className: classes, zDepth: this.props.zDepth}, 
          menuIconButton, 
          title, 
          this.props.children
        )
      );
    },

    _onMenuIconButtonTouchTap: function(e) {
      if (this.props.onMenuIconButtonTouchTap) this.props.onMenuIconButtonTouchTap(e);
    }

  });

  exports.AppBar = AppBar;

})(window.React, window.Classable, window.IconButton, window.Paper, window);
