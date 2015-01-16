(function(React, Classable, ClickAwayable, FlatButton, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable');
  // var ClickAwayable = require('./mixins/click-awayable');
  // var FlatButton = require('./flat-button.jsx');

  var Snackbar = React.createClass({displayName: "Snackbar",

    mixins: [Classable, ClickAwayable],

    propTypes: {
      action: React.PropTypes.string,
      message: React.PropTypes.string.isRequired,
      openOnMount: React.PropTypes.bool,
      onActionTouchTap: React.PropTypes.func
    },

    manualBind: true,

    getInitialState: function() {
      return {
        open: this.props.openOnMount || false
      };
    },

    componentClickAway: function() {
      this.dismiss();
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (prevState.open != this.state.open) {
        if (this.state.open) {
          this._bindClickAway();
        } else {
          this._unbindClickAway();
        }
      }
    },

    render: function() {
      var classes = this.getClasses('mui-snackbar', {
        'mui-is-open': this.state.open
      }); 
      var action;

      if (this.props.action) {
        action = (
          React.createElement(FlatButton, {
            className: "mui-snackbar-action", 
            label: this.props.action, 
            onTouchTap: this.props.onActionTouchTap})
        );
      }

      return (
        React.createElement("span", {className: classes}, 
          React.createElement("span", {className: "mui-snackbar-message"}, this.props.message), 
          action
        )
      );
    },

    show: function() {
      this.setState({ open: true });
    },
    
    dismiss: function() {
      this.setState({ open: false });
    }

  });

  exports.Snackbar = Snackbar;

})(window.React, window.Classable, window.ClickAwayable, window.FlatButton, window);