
(function(React, Classable, DialogWindow, FlatButton, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable');
  // var DialogWindow = require('./dialog-window.jsx');
  // var FlatButton = require('./flat-button.jsx');

  var Dialog = React.createClass({displayName: "Dialog",

    mixins: [Classable],

    propTypes: {
      title: React.PropTypes.string,
      actions: React.PropTypes.array
    },

    getDefaultProps: function() {
      return {
        actions: []
      };
    },

    render: function() {
      var {
        className,
        title,
        actions,
        ...other
      } = this.props;
      var classes = this.getClasses('mui-dialog');
      var actions = this._getDialogActions();

      return (
        React.createElement(DialogWindow, React.__spread({}, 
          other, 
          {ref: "dialogWindow", 
          className: classes, 
          actions: actions}), 

          React.createElement("h3", {className: "mui-dialog-title"}, this.props.title), 
          React.createElement("div", {ref: "dialogContent", className: "mui-dialog-content"}, 
            this.props.children
          )
          
        )
      );
    },

    dismiss: function() {
      this.refs.dialogWindow.dismiss();
    },

    show: function() {
      this.refs.dialogWindow.show();
    },

    _getDialogActions: function() {
      return this.props.actions.map(function(a, index) {
        var onClickHandler = a.onClick ? a.onClick : this.dismiss;
        return (
          React.createElement(FlatButton, {
            key: index, 
            secondary: true, 
            onClick: onClickHandler, 
            label: a.text})
        );
      }.bind(this));
    }

  });

  exports.Dialog = Dialog;

})(window.React, window.Classable, window.DialogWindow, window.FlatButton, window);
