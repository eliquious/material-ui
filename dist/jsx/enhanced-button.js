(function(React, KeyCode, WindowListenable, FocusRipple, TouchRipple, exports) {

  // var React = require('react');
  // var KeyCode = require('./utils/key-code.js');
  // var Classable = require('./mixins/classable.js');
  // var WindowListenable = require('./mixins/window-listenable');
  // var FocusRipple = require('./ripples/focus-ripple.jsx');
  // var TouchRipple = require('./ripples/touch-ripple.jsx');

  var EnhancedButton = React.createClass({displayName: "EnhancedButton",

    mixins: [Classable, WindowListenable],

    propTypes: {
      centerRipple: React.PropTypes.bool,
      className: React.PropTypes.string,
      disabled: React.PropTypes.bool,
      disableFocusRipple: React.PropTypes.bool,
      disableTouchRipple: React.PropTypes.bool,
      linkButton: React.PropTypes.bool,
      onBlur: React.PropTypes.func,
      onFocus: React.PropTypes.func,
      onTouchTap: React.PropTypes.func
    },

    windowListeners: {
      'keydown': '_handleWindowKeydown',
      'keyup': '_handleWindowKeyup'
    },

    getInitialState: function() {
      return {
        isKeyboardFocused: false 
      };
    },

    render: function() {
      var {
        centerRipple,
        disabled,
        disableFocusRipple,
        disableTouchRipple,
        linkButton,
        onBlur,
        onFocus,
        onTouchTap,
        ...other } = this.props;
      var classes = this.getClasses('mui-enhanced-button', {
        'mui-is-disabled': disabled,
        'mui-is-keyboard-focused': this.state.isKeyboardFocused,
        'mui-is-link-button': linkButton
      });
      var touchRipple = (
        React.createElement(TouchRipple, {
          ref: "touchRipple", 
          centerRipple: centerRipple})
      );
      var focusRipple = (
        React.createElement(FocusRipple, {
          show: this.state.isKeyboardFocused})
      );
      var buttonProps = {
        className: classes,
        disabled: disabled,
        onBlur: this._handleBlur,
        onFocus: this._handleFocus,
        onTouchTap: this._handleTouchTap
      };
      var buttonChildren = [
        this.props.children,
        disabled || disableTouchRipple ? null : touchRipple,
        disabled || disableFocusRipple ? null : focusRipple
      ];

      if (disabled && linkButton) {
        return (
          React.createElement("span", React.__spread({},  other, 
            {className: classes, 
            disabled: disabled}), 
            this.props.children
          )
        );
      }

      return linkButton ? (
        React.createElement("a", React.__spread({},  other,  buttonProps), 
          buttonChildren
        )
      ) : (
        React.createElement("button", React.__spread({},  other,  buttonProps), 
          buttonChildren
        )
      );
    },

    isKeyboardFocused: function() {
      return this.state.isKeyboardFocused;
    },

    _handleWindowKeydown: function(e) {
      if (e.keyCode == KeyCode.TAB) this._tabPressed = true;
      if (e.keyCode == KeyCode.ENTER && this.state.isKeyboardFocused) {
        this._handleTouchTap(e);
      }
    },

    _handleWindowKeyup: function(e) {
      if (e.keyCode == KeyCode.SPACE && this.state.isKeyboardFocused) {
        this._handleTouchTap(e);
      }
    },

    _handleBlur: function(e) {
      this.setState({
        isKeyboardFocused: false
      });

      if (this.props.onBlur) this.props.onBlur(e);
    },

    _handleFocus: function(e) {
      //setTimeout is needed because the focus event fires first
      //Wait so that we can capture if this was a keyboard focus
      //or touch focus
      setTimeout(function() {
        if (this._tabPressed) {
          this.setState({
            isKeyboardFocused: true
          });
        }
      }.bind(this), 150);
      
      if (this.props.onFocus) this.props.onFocus(e);
    },

    _handleTouchTap: function(e) {
      this._tabPressed = false;
      this.setState({
        isKeyboardFocused: false
      });
      if (this.props.onTouchTap) this.props.onTouchTap(e);
    }

  });

  exports.EnhancedButton = EnhancedButton;
  
})(window.React, window.KeyCode, window.WindowListenable, window.FocusRipple, window.TouchRipple, window);

