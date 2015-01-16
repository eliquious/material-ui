(function(React, Classable, WindowListenable, KeyCode, Calendar, DialogWindow, 
  FlatButton, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable.js');
  // var WindowListenable = require('../mixins/window-listenable.js');
  // var KeyCode = require('../utils/key-code.js');
  // var Calendar = require('./calendar.jsx');
  // var DialogWindow = require('../dialog-window.jsx');
  // var FlatButton = require('../flat-button.jsx');

  var DatePickerDialog = React.createClass({displayName: "DatePickerDialog",

    mixins: [Classable, WindowListenable],

    propTypes: {
      initialDate: React.PropTypes.object,
      onAccept: React.PropTypes.func
    },

    windowListeners: {
      'keyup': '_handleWindowKeyUp'
    },

    getInitialState: function() {
      return {
        isCalendarActive: false
      };
    },

    render: function() {
      var {
        initialDate,
        onAccept,
        ...other
      } = this.props;
      var classes = this.getClasses('mui-date-picker-dialog');
      var actions = [
        React.createElement(FlatButton, {
          key: 0, 
          label: "Cancel", 
          secondary: true, 
          onTouchTap: this._handleCancelTouchTap}),
        React.createElement(FlatButton, {
          key: 1, 
          label: "OK", 
          secondary: true, 
          onTouchTap: this._handleOKTouchTap})
      ];

      return (
        React.createElement(DialogWindow, React.__spread({},  other, 
          {ref: "dialogWindow", 
          className: classes, 
          actions: actions, 
          contentClassName: "mui-date-picker-dialog-window", 
          onDismiss: this._handleDialogDismiss, 
          onShow: this._handleDialogShow, 
          repositionOnUpdate: false}), 
          React.createElement(Calendar, {
            ref: "calendar", 
            initialDate: this.props.initialDate, 
            isActive: this.state.isCalendarActive})
        )
      );
    },

    show: function() {
      this.refs.dialogWindow.show();
    },

    dismiss: function() {
      this.refs.dialogWindow.dismiss();
    },

    _handleCancelTouchTap: function() {
      this.dismiss();
    },

    _handleOKTouchTap: function() {
      this.dismiss();
      if (this.props.onAccept) {
        this.props.onAccept(this.refs.calendar.getSelectedDate());
      }
    },

    _handleDialogShow: function() {
      this.setState({
        isCalendarActive: true
      });
    },

    _handleDialogDismiss: function() {
      this.setState({
        isCalendarActive: false
      });
    },

    _handleWindowKeyUp: function(e) {
      if (this.refs.dialogWindow.isOpen()) {
        switch (e.keyCode) {
          case KeyCode.ENTER:
            this._handleOKTouchTap();
            break;
        }
      } 
    }

  });

  exports.DatePickerDialog = DatePickerDialog;

})(window.React, window.Classable, window.WindowListenable, window.KeyCode,
  window.Calendar, window.DialogWindow, window.FlatButton, window);
