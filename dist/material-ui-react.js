(function(exports) {
  
  exports.Events = {

    once: function(el, type, callback) {
      var typeArray = type.split(' ');
      var recursiveFunction = function(e){
        e.target.removeEventListener(e.type, recursiveFunction);
        return callback(e);
      };

      for (var i = typeArray.length - 1; i >= 0; i--) {
        this.on(el, typeArray[i], recursiveFunction);
      }
    },

    // IE8+ Support
    on: function(el, type, callback) {
      if(el.addEventListener) {
        el.addEventListener(type, callback);
      } else {
        el.attachEvent('on' + type, function() {
          callback.call(el);
        });
      }
    },

    // IE8+ Support
    off: function(el, type, callback) {
      if(el.removeEventListener) {
        el.removeEventListener(type, callback);
      } else {
        el.detachEvent('on' + type, callback);
      }
    }
  };
  
})(window);

(function(exports) {

  exports.Dom = {

    isDescendant: function(parent, child) {
      var node = child.parentNode;

      while (node != null) {
        if (node == parent) return true;
        node = node.parentNode;
      }

      return false;
    },

    offset: function(el) {
      var rect = el.getBoundingClientRect()
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    },

    addClass: function(el, className) {
      if (el.classList)
        el.classList.add(className);
      else
        el.className += ' ' + className;
    },

    removeClass: function(el, className) {
      if (el.classList)
        el.classList.remove(className);
      else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },

    hasClass: function(el, className) {
      if (el.classList)
        return el.classList.contains(className);
      else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    },

    toggleClass: function(el, className) {
      if (this.hasClass(el, className))
        this.removeClass(el, className);
      else
        this.addClass(el, className);
    },

    forceRedraw: function(el) {
      var originalDisplay = el.style.display;

      el.style.display = 'none';
      el.offsetHeight;
      el.style.display = originalDisplay;
    },

    withoutTransition: function(el, callback) {
      //turn off transition
      el.style.transition = 'none';
      
      callback();

      //force a redraw
      this.forceRedraw(el);

      //put the transition back
      el.style.transition = '';
    }
  };
})(window);

(function(React, exports) {

  // var React = require('react/addons');
  var classSet = React.addons.classSet;

  var Classable = {

    propTypes: {
      className: React.PropTypes.string
    },

    getClasses: function(initialClasses, additionalClassObj) {
      var classString = '';

      //Initialize the classString with the classNames that were passed in
      if (this.props.className) classString += ' ' + this.props.className;

      //Add in initial classes
      if (typeof initialClasses === 'object') {
        classString += ' ' + classSet(initialClasses);
      } else {
        classString += ' ' + initialClasses;
      }

      //Add in additional classes
      if (additionalClassObj) classString += ' ' + classSet(additionalClassObj);

      //Convert the class string into an object and run it through the class set
      return classSet(this.getClassSet(classString));
    },

    getClassSet: function(classString) {
      var classObj = {};

      if (classString) {
        classString.split(' ').forEach(function(className) {
          if (className) classObj[className] = true;
        });
      }

      return classObj;
    }
  };

  exports.Classable = Classable;

})(window.React, window);

(function(Events, Dom, exports) {

  // var Events = require('../utils/events.js');
  // var Dom = require('../utils/dom.js');

  var ClickAwayable = {

    //When the component mounts, listen to click events and check if we need to
    //Call the componentClickAway function.
    componentDidMount: function() {
      if (!this.manualBind) this._bindClickAway();
    },

    componentWillUnmount: function() {
      if (!this.manualBind) this._unbindClickAway();
    },

    _checkClickAway: function(e) {
      var el = this.getDOMNode();

      // Check if the target is inside the current component
      if (this.isMounted() && 
        e.target != el &&
        !Dom.isDescendant(el, e.target)) {
        if (this.componentClickAway) this.componentClickAway();
      }
    },

    _bindClickAway: function() {
      Events.on(document, 'click', this._checkClickAway);
    },

    _unbindClickAway: function() {
      Events.off(document, 'click', this._checkClickAway);
    }

  };

  exports.ClickAwayable = ClickAwayable;

})(window.Events, window.Dom, window);

(function(Events, exports) {

  // var Events = require('../utils/events.js');

  var WindowListenable = {

    componentDidMount: function() {
      var listeners = this.windowListeners;

      for (var eventName in listeners) {
         var callbackName = listeners[eventName];
         Events.on(window, eventName, this[callbackName]);
      }
    },

    componentWillUnmount: function() {
      var listeners = this.windowListeners;

      for (var eventName in listeners) {
         var callbackName = listeners[eventName];
         Events.off(window, eventName, this[callbackName]);
      }
    }
    
  };
  
  exports.WindowListenable = WindowListenable;

})(window.Events, window);

(function(React, Classable, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js');

  var Paper = React.createClass({displayName: "Paper",

    mixins: [Classable],

    propTypes: {
      circle: React.PropTypes.bool,
      innerClassName: React.PropTypes.string,
      rounded: React.PropTypes.bool,
      zDepth: React.PropTypes.oneOf([0,1,2,3,4,5])
    },

    getDefaultProps: function() {
      return {
        innerClassName: '',
        rounded: true,
        zDepth: 1
      };
    },

    render: function() {
      var $__0=
        
        
        
        
        
           this.props,className=$__0.className,circle=$__0.circle,innerClassName=$__0.innerClassName,rounded=$__0.rounded,zDepth=$__0.zDepth,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,circle:1,innerClassName:1,rounded:1,zDepth:1}),
        classes = this.getClasses(
          'mui-paper ' +
          'mui-z-depth-' + this.props.zDepth, { 
          'mui-rounded': this.props.rounded,
          'mui-circle': this.props.circle
        }),
        insideClasses = 
          this.props.innerClassName + ' ' +
          'mui-paper-container ' +
          'mui-z-depth-bottom';

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}), 
          React.createElement("div", {ref: "innerContainer", className: insideClasses}, 
            this.props.children
          )
        )
      );
    },

    getInnerContainer: function() {
      return this.refs.innerContainer;
    }

  });

  exports.Paper = Paper;

})(window.React, window.Classable, window);

(function(React, Classable, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable.js');

  var Tooltip = React.createClass({displayName: "Tooltip",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      label: React.PropTypes.string.isRequired,
      show: React.PropTypes.bool,
      touch: React.PropTypes.bool
    },

    componentDidMount: function() {
      this._setRippleSize();
    },

    componentDidUpdate: function(prevProps, prevState) {
      this._setRippleSize();
    },

    render: function() {
      var $__0=
        
        
           this.props,className=$__0.className,label=$__0.label,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,label:1});
      var classes = this.getClasses('mui-tooltip', {
        'mui-is-shown': this.props.show,
        'mui-is-touch': this.props.touch
      });

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}), 
          React.createElement("div", {ref: "ripple", className: "mui-tooltip-ripple"}), 
          React.createElement("span", {className: "mui-tooltip-label"}, this.props.label)
        )
      );
    },

    _setRippleSize: function() {
      var ripple = this.refs.ripple.getDOMNode();
      var tooltipSize = this.getDOMNode().offsetWidth;
      var ripplePadding = this.props.touch ? 45 : 20;
      var rippleSize = tooltipSize + ripplePadding + 'px';

      if (this.props.show) {
        ripple.style.height = rippleSize;
        ripple.style.width = rippleSize;
      } else {
        ripple.style.width = '0px';
        ripple.style.height = '0px';
      }
    }

  });

  exports.Tooltip = Tooltip;

})(window.React, window.Classable, window);

(function(React, Classable, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js');

  var Icon = React.createClass({displayName: "Icon",

    mixins: [Classable],

    propTypes: {
      icon: React.PropTypes.string
    },

    render: function() {
      var $__0=      this.props,className=$__0.className,icon=$__0.icon,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,icon:1}),
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

(function(React, Classable, exports) {
  
  // var React = require('react');
  // var Classable = require('../mixins/classable');

  var RippleCircle = React.createClass({displayName: "RippleCircle",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      started: React.PropTypes.bool,
      ending: React.PropTypes.bool
    },

    render: function() {
      var $__0=
        
        
        
        
        this.props,innerClassName=$__0.innerClassName,started=$__0.started,ending=$__0.ending,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{innerClassName:1,started:1,ending:1});
      var classes = this.getClasses('mui-ripple-circle', {
        'mui-is-started': this.props.started,
        'mui-is-ending': this.props.ending
      });

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}), 
          React.createElement("div", {className: "mui-ripple-circle-inner"})
        )
      );
    }

  });

  exports.RippleCircle = RippleCircle;

})(window.React, window.Classable, window);

(function(React, Classable, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable');

  var FocusRipple = React.createClass({displayName: "FocusRipple",

    mixins: [Classable],

    propTypes: {
      show: React.PropTypes.bool
    },

    componentDidMount: function() {
      this._setRippleSize();
    },

    render: function() {
      var classes = this.getClasses('mui-focus-ripple', {
        'mui-is-shown': this.props.show
      });

      return (
        React.createElement("div", {className: classes}, 
          React.createElement("div", {className: "mui-focus-ripple-inner"})
        )
      );
    },

    _setRippleSize: function() {
      var el = this.getDOMNode();
      var height = el.offsetHeight;
      var width = el.offsetWidth;
      var size = Math.max(height, width);

      el.style.height = size + 'px';
      el.style.top = (size / 2 * -1) + (height / 2) + 'px';
    }

  });

  exports.FocusRipple = FocusRipple;

})(window.React, window.Classable, window);

(function(React, Classable, Dom, RippleCircle, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable');
  // var Dom = require('../utils/dom.js');
  // var RippleCircle = require('./circle.jsx');

  var TouchRipple = React.createClass({displayName: "TouchRipple",

    mixins: [Classable],

    propTypes: {
      centerRipple: React.PropTypes.bool,
      className: React.PropTypes.string
    },

    getInitialState: function() {
      return {
        ripples: [{
          key: 0,
          started: false,
          ending: false
        }]
      };
    },

    render: function() {
      var classes = this.getClasses('mui-touch-ripple');

      return (
        React.createElement("div", {
          className: classes, 
          onMouseUp: this._handleMouseUp, 
          onMouseDown: this._handleMouseDown, 
          onMouseOut: this._handleMouseOut, 
          onTouchStart: this._handleTouchStart, 
          onTouchEnd: this._handleTouchEnd}, 
          this._getRippleElements()
        )
      );
    },

    start: function(e) {
      var ripples = this.state.ripples;
      var nextKey = ripples[ripples.length-1].key + 1;
      var style = !this.props.centerRipple ? this._getRippleStyle(e) : {};
      var ripple;

      //Start the next unstarted ripple
      for (var i = 0; i < ripples.length; i++) {
        ripple = ripples[i];
        if (!ripple.started) {
          ripple.started = true;
          ripple.style = style;
          break;
        }
      };

      //Add an unstarted ripple at the end
      ripples.push({
        key: nextKey,
        started: false,
        ending: false
      });

      //Re-render
      this.setState({
        ripples: ripples
      });
    },

    end: function() {
      var ripples = this.state.ripples;
      var ripple;
      var endingRipple;

      //End the the next un-ended ripple
      for (var i = 0; i < ripples.length; i++) {
        ripple = ripples[i];
        if (ripple.started && !ripple.ending) {
          ripple.ending = true;
          endingRipple = ripple;
          break;
        }
      };

      //Only update if a ripple was found
      if (endingRipple) {
        //Re-render
        this.setState({
          ripples: ripples
        });

        //Wait 2 seconds and remove the ripple from DOM
        setTimeout(function() {
          ripples.shift();
          if (this.isMounted()) {
            this.setState({
              ripples: ripples
            });
          }
        }.bind(this), 2000);
      }
    },

    _handleMouseDown: function(e) {
      //only listen to left clicks
      if (e.button === 0) this.start(e);
    },

    _handleMouseUp: function(e) {
      this.end();
    },

    _handleMouseOut: function(e) {
      this.end();
    },

    _handleTouchStart: function(e) {
      this.start(e);
    },

    _handleTouchEnd: function(e) {
      this.end();
    },

    _getRippleStyle: function(e) {
      var style = {};
      var el = this.getDOMNode();
      var elHeight = el.offsetHeight;
      var elWidth = el.offsetWidth;
      var offset = Dom.offset(el);
      var pageX = e.pageX == undefined ? e.nativeEvent.pageX : e.pageX;
      var pageY = e.pageY == undefined ? e.nativeEvent.pageY : e.pageY;
      var pointerX = pageX - offset.left;
      var pointerY = pageY - offset.top;
      var topLeftDiag = this._calcDiag(pointerX, pointerY);
      var topRightDiag = this._calcDiag(elWidth - pointerX, pointerY);
      var botRightDiag = this._calcDiag(elWidth - pointerX, elHeight - pointerY);
      var botLeftDiag = this._calcDiag(pointerX, elHeight - pointerY);
      var rippleRadius = Math.max(
        topLeftDiag, topRightDiag, botRightDiag, botLeftDiag
      );
      var rippleSize = rippleRadius * 2;
      var left = pointerX - rippleRadius;
      var top = pointerY - rippleRadius;

      style.height = rippleSize + 'px';
      style.width = rippleSize + 'px';
      style.top = top + 'px';
      style.left = left + 'px';

      return style;
    },

    _calcDiag: function(a, b) {
      return Math.sqrt((a * a) + (b * b));
    },

    _getRippleElements: function() {
      return this.state.ripples.map(function(ripple) {
        return (
          React.createElement(RippleCircle, {
            key: ripple.key, 
            started: ripple.started, 
            ending: ripple.ending, 
            style: ripple.style})
        );
      }.bind(this));
    }

  });

  exports.TouchRipple = TouchRipple;

})(window.React, window.Classable, window.Dom, window.RippleCircle, window);

(function(exports) {
  
  exports.KeyCode = {
    DOWN: 40,
    ESC: 27,
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
  };
  
})(window);

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
      var $__0=
        
        
        
        
        
        
        
        
           this.props,centerRipple=$__0.centerRipple,disabled=$__0.disabled,disableFocusRipple=$__0.disableFocusRipple,disableTouchRipple=$__0.disableTouchRipple,linkButton=$__0.linkButton,onBlur=$__0.onBlur,onFocus=$__0.onFocus,onTouchTap=$__0.onTouchTap,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{centerRipple:1,disabled:1,disableFocusRipple:1,disableTouchRipple:1,linkButton:1,onBlur:1,onFocus:1,onTouchTap:1});
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


(function(React, Classable, EnhancedButton, Icon, Tooltip, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable.js');
  // var EnhancedButton = require('./enhanced-button.jsx');
  // var Icon = require('./icon.jsx');
  // var Tooltip = require('./tooltip.jsx');

  var IconButton = React.createClass({displayName: "IconButton",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      disabled: React.PropTypes.bool,
      icon: React.PropTypes.string.isRequired,
      onBlur: React.PropTypes.func,
      onFocus: React.PropTypes.func,
      tooltip: React.PropTypes.string,
      touch: React.PropTypes.bool
    },

    getInitialState: function() {
      return {
        tooltipShown: false 
      };
    },

    componentDidMount: function() {
      if (this.props.tooltip) {
        this._positionTooltip();
      }
    },

    render: function() {
      var $__0=
        
        
        
           this.props,icon=$__0.icon,tooltip=$__0.tooltip,touch=$__0.touch,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{icon:1,tooltip:1,touch:1});
      var classes = this.getClasses('mui-icon-button');
      var tooltip;

      if (this.props.tooltip) {
        tooltip = (
          React.createElement(Tooltip, {
            ref: "tooltip", 
            className: "mui-icon-button-tooltip", 
            label: tooltip, 
            show: this.state.tooltipShown, 
            touch: touch})
        );
      }

      return (
        React.createElement(EnhancedButton, React.__spread({},  other, 
          {ref: "button", 
          centerRipple: true, 
          className: classes, 
          onBlur: this._handleBlur, 
          onFocus: this._handleFocus, 
          onMouseOut: this._handleMouseOut, 
          onMouseOver: this._handleMouseOver}), 

          tooltip, 
          React.createElement(Icon, {icon: icon})

        )
      );
    },

    _positionTooltip: function() {
      var tooltip = this.refs.tooltip.getDOMNode();
      var tooltipWidth = tooltip.offsetWidth;
      var buttonWidth = 48;

      tooltip.style.left = (tooltipWidth - buttonWidth) / 2 * -1 + 'px';
    },

    _showTooltip: function() {
      if (!this.props.disabled) this.setState({ tooltipShown: true });
    },

    _hideTooltip: function() {
      this.setState({ tooltipShown: false });
    },

    _handleBlur: function(e) {
      this._hideTooltip();
      if (this.props.onBlur) this.props.onBlur(e);
    },

    _handleFocus: function(e) {
      this._showTooltip();
      if (this.props.onFocus) this.props.onFocus(e);
    },

    _handleMouseOut: function(e) {
      if (!this.refs.button.isKeyboardFocused()) this._hideTooltip();
      if (this.props.onMouseOut) this.props.onMouseOut(e);
    },

    _handleMouseOver: function(e) {
      this._showTooltip();
      if (this.props.onMouseOver) this.props.onMouseOver(e);
    }

  });

  exports.IconButton = IconButton;

})(window.React, window.Classable, window.EnhancedButton, window.Icon, window.Tooltip, window);

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

(function(React, Classable, exports){

  var AppCanvas = React.createClass({displayName: "AppCanvas",

    mixins: [Classable],

    propTypes: {
      predefinedLayout: React.PropTypes.number
    },

    render: function() {
      var classes = this.getClasses({
        'mui-app-canvas': true,
        'mui-predefined-layout-1': this.props.predefinedLayout === 1
      });

      return (
        React.createElement("div", {className: classes}, 
          this.props.children
        )
      );
    }
  });

  exports.AppCanvas = AppCanvas;

})(window.React, window.Classable, window);


(function(React, Classable, exports) {
  
  var Checkbox = React.createClass({displayName: "Checkbox",

    propTypes: {
      label: React.PropTypes.string,
      name: React.PropTypes.string.isRequired,
      onClick: React.PropTypes.func,
      onCheck: React.PropTypes.func,
      value: React.PropTypes.string.isRequired,
      checked: React.PropTypes.bool
    },

    mixins: [Classable],

    getInitialState: function() {
      return {
        checked: this.props.checked || false
      }
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.hasOwnProperty('checked')) this.setState({checked: nextProps.checked});
    },

    check: function() {
      this.setState({ checked: !this.state.checked });
      this.refs.checkbox.getDOMNode().checked = !this.refs.checkbox.getDOMNode().checked;

    },

    render: function() {

      var classes = this.getClasses('mui-checkbox');

      var componentclasses = React.addons.classSet({
        'mui-checkbox-component': true,
        'mui-checked': this.state.checked === true
      });

      return (
        React.createElement("div", {className: classes}, 
          React.createElement("div", {className: componentclasses, onClick: this._onClick}, 
            React.createElement("input", {
              ref: "checkbox", 
              type: "checkbox", 
              name: this.props.name, 
              value: this.props.value}), 
            React.createElement("span", {className: "mui-checkbox-box"}), 
            React.createElement("span", {className: "mui-checkbox-check"})
          ), 
          React.createElement("span", {className: "mui-checkbox-label"}, this.props.label)
        )
      );
    },

    _onClick: function(e) {
      var checkedState = this.state.checked;

      this.check();

      if (this.props.onClick) this.props.onClick(e, !checkedState);
    }

  });

  exports.Checkbox = Checkbox;

})(window.React, window.Classable, window);

(function(Events, exports) {

  // var Events = require('./events.js');

  var CssEvent = {

    _testSupportedProps: function(props) {
      var i,
        undefined,
        el = document.createElement('div');

      for (i in props) {
        if (props.hasOwnProperty(i) && el.style[i] !== undefined) {
          return props[i];
        }
      }
    },

    //Returns the correct event name to use
    transitionEndEventName: function() {
      return this._testSupportedProps({
        'transition':'transitionend',
        'OTransition':'otransitionend',  
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      });
    },

    animationEndEventName: function() {
      return this._testSupportedProps({
        'animation': 'animationend',
        '-o-animation': 'oAnimationEnd',
        '-moz-animation': 'animationend',
        '-webkit-animation': 'webkitAnimationEnd'
      });
    },

    onTransitionEnd: function (el, callback) {
      var transitionEnd = this.transitionEndEventName();

      Events.once(el, transitionEnd, function() {
        return callback();
      });
    },

    onAnimationEnd: function (el, callback) {
      var animationEnd = this.animationEndEventName();

      Events.once(el, animationEnd, function() {
        return callback();
      });
    }
  };

  exports.CssEvent = CssEvent;

})(window.Events, window);

(function(React, Classable, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js');

  var Overlay = React.createClass({displayName: "Overlay",

    mixins: [Classable],

    propTypes: {
      show: React.PropTypes.bool
    },

    render: function() {
      var 
        $__0=
          
          
          this.props,className=$__0.className,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1}),
        classes = this.getClasses('mui-overlay', {
          'mui-is-shown': this.props.show
        });

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}))
      );
    }

  });

  exports.Overlay = Overlay;

})(window.React, window.Classable, window);


(function(React, WindowListenable, CssEvent, KeyCode, Classable, Overlay, Paper, exports) {
  
  // var React = require('react');
  // var WindowListenable = require('./mixins/window-listenable.js');
  // var CssEvent = require('./utils/css-event.js');
  // var KeyCode = require('./utils/key-code.js');
  // var Classable = require('./mixins/classable');
  // var Overlay = require('./overlay.jsx');
  // var Paper = require('./paper.jsx');

  var DialogWindow = React.createClass({displayName: "DialogWindow",

    mixins: [Classable, WindowListenable],

    propTypes: {
      actions: React.PropTypes.array,
      contentClassName: React.PropTypes.string,
      openImmediately: React.PropTypes.bool,
      onClickAway: React.PropTypes.func,
      onDismiss: React.PropTypes.func,
      onShow: React.PropTypes.func,
      repositionOnUpdate: React.PropTypes.bool
    },

    windowListeners: {
      'keyup': '_handleWindowKeyUp'
    },

    getDefaultProps: function() {
      return {
        actions: [],
        repositionOnUpdate: true
      };
    },

    getInitialState: function() {
      return {
        open: this.props.openImmediately || false
      };
    },

    componentDidMount: function() {
      this._positionDialog();
    },

    componentDidUpdate: function (prevProps, prevState) {
      this._positionDialog();
    },

    render: function() {
      var classes = this.getClasses('mui-dialog-window', {
        'mui-is-shown': this.state.open
      });
      var contentClasses = 'mui-dialog-window-contents';
      var actions = this._getActions();

      if (this.props.contentClassName) {
        contentClasses += ' ' + this.props.contentClassName;
      }

      return (
        React.createElement("div", {className: classes}, 
          React.createElement(Paper, {ref: "dialogWindow", className: contentClasses, zDepth: 4}, 
            this.props.children, 
            actions
          ), 
          React.createElement(Overlay, {show: this.state.open, onTouchTap: this._handleOverlayTouchTap})
        )
      );
    },

    isOpen: function() {
      return this.state.open;
    },

    dismiss: function() {

      CssEvent.onTransitionEnd(this.getDOMNode(), function() {
        //allow scrolling
        var body = document.getElementsByTagName('body')[0];
        body.style.overflow = '';
        body.style.position = '';
      });

      this.setState({ open: false });
      if (this.props.onDismiss) this.props.onDismiss();
    },

    show: function() {
      //prevent scrolling
      var body = document.getElementsByTagName('body')[0];
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';

      this.setState({ open: true });
      if (this.props.onShow) this.props.onShow();
    },

    _getActions: function() {
      var actionContainer;
      var actions = this.props.actions;
      var actionClassName;

      if (actions.length) {

        for (var i = 0; i < actions.length; i++) {
          actionClassName = actions[i].props.className;

          actions[i].props.className = actionClassName ?
            actionClassName + ' mui-dialog-window-action' :
            'mui-dialog-window-action';
        };

        actionContainer = (
          React.createElement("div", {className: "mui-dialog-window-actions"}, 
            actions
          )
        );

      }

      return actionContainer;
    },

    _positionDialog: function() {
      var container, dialogWindow, containerHeight, dialogWindowHeight;

      if (this.state.open) {

        container = this.getDOMNode(),
        dialogWindow = this.refs.dialogWindow.getDOMNode(),
        containerHeight = container.offsetHeight,

        //Reset the height in case the window was resized.
        dialogWindow.style.height = '';
        dialogWindowHeight = dialogWindow.offsetHeight;

        //Vertically center the dialog window, but make sure it doesn't
        //transition to that position.
        if (this.props.repositionOnUpdate || !container.style.paddingTop) {
          container.style.paddingTop = 
            ((containerHeight - dialogWindowHeight) / 2) - 64 + 'px';
        }
        

      }
    },

    _handleOverlayTouchTap: function() {
      this.dismiss();
      if (this.props.onClickAway) this.props.onClickAway();
    },

    _handleWindowKeyUp: function(e) {
      if (e.keyCode == KeyCode.ESC) {
        this.dismiss();
      }
    }
  });

  exports.DialogWindow = DialogWindow;

})(window.React, WindowListenable, CssEvent, KeyCode, Classable, Overlay, Paper, window);

(function(React, Classable, EnhancedButton, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable.js');
  // var EnhancedButton = require('./enhanced-button.jsx');

  var FlatButton = React.createClass({displayName: "FlatButton",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      label: React.PropTypes.string.isRequired,
      primary: React.PropTypes.bool,
      secondary: React.PropTypes.bool
    },

    render: function() {
      var $__0=
          
          
          
          
          this.props,label=$__0.label,primary=$__0.primary,secondary=$__0.secondary,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{label:1,primary:1,secondary:1});
      var classes = this.getClasses('mui-flat-button', {
        'mui-is-primary': primary,
        'mui-is-secondary': !primary && secondary
      });

      return (
        React.createElement(EnhancedButton, React.__spread({},  other, 
          {className: classes}), 
          React.createElement("span", {className: "mui-flat-button-label"}, label)
        )
      );
    }

  });

  exports.FlatButton = FlatButton;

})(window.React, window.Classable, window.EnhancedButton, window);


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
      var $__0=
        
        
        
        
        this.props,className=$__0.className,title=$__0.title,actions=$__0.actions,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,title:1,actions:1});
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

(function(exports) {

  exports.KeyLine = {

    Desktop: {
      GUTTER: 24,
      GUTTER_LESS: 16,
      INCREMENT: 64,
      MENU_ITEM_HEIGHT: 32
    },

    getIncrementalDim: function(dim) {
      return Math.ceil(dim / this.Desktop.INCREMENT) * this.Desktop.INCREMENT;
    }
  };

})(window);

(function(React, Classable, Paper, exports) {

  // var React = require('react'),
  //     Classable = require('./mixins/classable.js'),
  //     Paper = require('./paper.jsx');

  var Toggle = React.createClass({displayName: "Toggle",
    propTypes: {
      onToggle: React.PropTypes.func,
      toggled: React.PropTypes.bool,
      label: React.PropTypes.string
    },

    mixins: [Classable],

    getInitialState: function() {
      return {
        toggled: this.props.toggled
      }
    },


  componentWillReceiveProps: function (nextProps) {
    if (nextProps.hasOwnProperty('toggled')) this.setState({toggled: nextProps.toggled});
  },

  render: function() {
    var classes = this.getClasses('mui-toggle', {
      'mui-is-toggled': this.state.toggled
    })

    return (
      React.createElement("div", {className: "mui-toggle-wrap"}, 
        this.props.label ? React.createElement("div", {className: "mui-toggle-label", onTouchTap: this._handleTouchTap}, this.props.label) : '', 
        React.createElement("div", {className: classes, onTouchTap: this._handleTouchTap}, 
          React.createElement("div", {className: "mui-toggle-track"}), 
          React.createElement(Paper, {className: "mui-toggle-thumb", zDepth: 1})
        )
      )
    );
  },

    _handleTouchTap: function(e) {
      var toggledState = !this.state.toggled;

      this.setState({ toggled: toggledState });

      if (this.props.onToggle) this.props.onToggle(e, toggledState);
    }

  });

  exports.Toggle = Toggle;

})(window.React, window.Classable, window.Paper, window);

(function(React, Classable, Icon, Toggle, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js'),
  //   Icon = require('./icon.jsx'),
  //   Toggle = require('./toggle.jsx'),

    Types = {
      LINK: 'LINK',
      SUBHEADER: 'SUBHEADER',
      NESTED: 'NESTED'
    };

  var MenuItem = React.createClass({displayName: "MenuItem",

    mixins: [Classable],

    propTypes: {
      index: React.PropTypes.number.isRequired,
      icon: React.PropTypes.string,
      iconRight: React.PropTypes.string,
      attribute: React.PropTypes.string,
      number: React.PropTypes.string,
      data: React.PropTypes.string,
      toggle: React.PropTypes.bool,
      onClick: React.PropTypes.func,
      onToggle: React.PropTypes.func,
      selected: React.PropTypes.bool
    },

    statics: {
      Types: Types
    },

    getDefaultProps: function() {
      return {
        toggle: false
      };
    },

    render: function() {
      var classes = this.getClasses('mui-menu-item', {
          'mui-selected': this.props.selected
        }),
        icon,
        data,
        iconRight,
        attribute,
        number,
        toggle;

      if (this.props.icon) icon = React.createElement(Icon, {className: "mui-menu-item-icon", icon: this.props.icon});
      if (this.props.data) data = React.createElement("span", {className: "mui-menu-item-data"}, this.props.data);
      if (this.props.iconRight) iconRight = React.createElement(Icon, {className: "mui-menu-item-icon-right", icon: this.props.iconRight});
      if (this.props.number !== undefined) number = React.createElement("span", {className: "mui-menu-item-number"}, this.props.number);
      if (this.props.attribute !== undefined) attribute = React.createElement("span", {className: "mui-menu-item-attribute"}, this.props.attribute);
      if (this.props.toggle) toggle = React.createElement(Toggle, {onToggle: this._onToggleClick});

      return (
        React.createElement("div", {key: this.props.index, className: classes, onTouchTap: this._onClick}, 
          icon, 
          this.props.children, 
          data, 
          attribute, 
          number, 
          toggle, 
          iconRight
        )
      );
    },

    _onClick: function(e) {
      var _this = this;

      //animate the ripple
      // this.refs.ripple.animate(e, function() {
        if (_this.props.onClick) _this.props.onClick(e, _this.props.index);
      // });
    },

    _onToggleClick: function(e, toggled) {
      if (this.props.onToggle) this.props.onToggle(e, this.props.index, toggled);
    }

  });
  exports.MenuItem = MenuItem;

})(window.React, window.Classable, window.Icon, window.Toggle, window);

(function(React, CssEvent, Dom, KeyLine, Classable, ClickAwayable, Paper, MenuItem, exports) {

  // var React = require('react'),
  //   CssEvent = require('./utils/css-event.js'),
  //   Dom = require('./utils/dom.js'),
  //   KeyLine = require('./utils/key-line.js'),
  //   Classable = require('./mixins/classable.js'),
  //   ClickAwayable = require('./mixins/click-awayable'),
  //   Paper = require('./paper.jsx'),
  //   MenuItem = require('./menu-item.jsx');

  /***********************
   * Nested Menu Component
   ***********************/
  var NestedMenuItem = React.createClass({displayName: "NestedMenuItem",

    mixins: [Classable, ClickAwayable],

    propTypes: {
      index: React.PropTypes.number.isRequired,
      text: React.PropTypes.string,
      menuItems: React.PropTypes.array.isRequired,
      zDepth: React.PropTypes.number,
      onItemClick: React.PropTypes.func
    },

    getInitialState: function() {
      return { open: false }
    },

    componentClickAway: function() {
      this.setState({ open: false });
    },

    componentDidMount: function() {
      this._positionNestedMenu();
    },

    componentDidUpdate: function(prevProps, prevState) {
      this._positionNestedMenu();
    },

    render: function() {
      var classes = this.getClasses('mui-nested-menu-item', {
        'mui-open': this.state.open
      });

      return (
        React.createElement("div", {className: classes}, 
          React.createElement(MenuItem, {index: this.props.index, iconRight: "mui-icon-arrow-drop-right", onClick: this._onParentItemClick}, 
            this.props.text
          ), 
          React.createElement(Menu, {
            ref: "nestedMenu", 
            menuItems: this.props.menuItems, 
            onItemClick: this._onMenuItemClick, 
            hideable: true, 
            visible: this.state.open, 
            zDepth: this.props.zDepth + 1})
        )
      );
    },

    _positionNestedMenu: function() {
      var el = this.getDOMNode(),
        nestedMenu = this.refs.nestedMenu.getDOMNode();

      nestedMenu.style.left = el.offsetWidth + 'px';
    },

    _onParentItemClick: function() {
      this.setState({ open: !this.state.open });
    },

    _onMenuItemClick: function(e, index, menuItem) {
      this.setState({ open: false });
      if (this.props.onItemClick) this.props.onItemClick(e, index, menuItem);
    }

  });

  /****************
   * Menu Component
   ****************/
  var Menu = React.createClass({displayName: "Menu",

    mixins: [Classable],

    propTypes: {
      autoWidth: React.PropTypes.bool,
      onItemClick: React.PropTypes.func,
      onToggleClick: React.PropTypes.func,
      menuItems: React.PropTypes.array.isRequired,
      selectedIndex: React.PropTypes.number,
      hideable: React.PropTypes.bool,
      visible: React.PropTypes.bool,
      zDepth: React.PropTypes.number
    },

    getInitialState: function() {
      return { nestedMenuShown: false }
    },

    getDefaultProps: function() {
      return {
        autoWidth: true,
        hideable: false,
        visible: true,
        zDepth: 1
      };
    },

    componentDidMount: function() {
      var el = this.getDOMNode();

      //Set the menu with
      this._setKeyWidth(el);

      //Save the initial menu height for later
      this._initialMenuHeight = el.offsetHeight + KeyLine.Desktop.GUTTER_LESS;

      //Show or Hide the menu according to visibility
      this._renderVisibility();
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (this.props.visible !== prevProps.visible) this._renderVisibility();
    },

    render: function() {
      var classes = this.getClasses('mui-menu', {
        'mui-menu-hideable': this.props.hideable,
        'mui-visible': this.props.visible
      });

      return (
        React.createElement(Paper, {ref: "paperContainer", zDepth: this.props.zDepth, className: classes}, 
          this._getChildren()
        )
      );
    },

    _getChildren: function() {
      var children = [],
        menuItem,
        itemComponent,
        isSelected;

      //This array is used to keep track of all nested menu refs
      this._nestedChildren = [];

      for (var i=0; i < this.props.menuItems.length; i++) {
        menuItem = this.props.menuItems[i];
        isSelected = i === this.props.selectedIndex;

        switch (menuItem.type) {

          case MenuItem.Types.LINK:
            itemComponent = (
              React.createElement("a", {key: i, index: i, className: "mui-menu-item", href: menuItem.payload}, menuItem.text)
            );
          break;

          case MenuItem.Types.SUBHEADER:
            itemComponent = (
              React.createElement("div", {key: i, index: i, className: "mui-subheader"}, menuItem.text)
            );
            break;

          case MenuItem.Types.NESTED:
            itemComponent = (
              React.createElement(NestedMenuItem, {
                ref: i, 
                key: i, 
                index: i, 
                text: menuItem.text, 
                menuItems: menuItem.items, 
                zDepth: this.props.zDepth, 
                onItemClick: this._onNestedItemClick})
            );
            this._nestedChildren.push(i);
            break;

          default:
            itemComponent = (
              React.createElement(MenuItem, {
                selected: isSelected, 
                key: i, 
                index: i, 
                icon: menuItem.icon, 
                data: menuItem.data, 
                attribute: menuItem.attribute, 
                number: menuItem.number, 
                toggle: menuItem.toggle, 
                onClick: this._onItemClick, 
                onToggle: this._onItemToggle}, 
                menuItem.text
              )
            );
        }
        children.push(itemComponent);
      }

      return children;
    },

    _setKeyWidth: function(el) {
      var menuWidth = this.props.autoWidth ?
        KeyLine.getIncrementalDim(el.offsetWidth) + 'px' :
        '100%';

      //Update the menu width
      Dom.withoutTransition(el, function() {
        el.style.width = menuWidth;
      });
    },

    _renderVisibility: function() {
      var el;

      if (this.props.hideable) {
        el = this.getDOMNode();
        var innerContainer = this.refs.paperContainer.getInnerContainer().getDOMNode();
        
        if (this.props.visible) {

          //Open the menu
          el.style.height = this._initialMenuHeight + 'px';

          //Set the overflow to visible after the animation is done so
          //that other nested menus can be shown
          CssEvent.onTransitionEnd(el, function() {
            //Make sure the menu is open before setting the overflow.
            //This is to accout for fast clicks
            if (this.props.visible) innerContainer.style.overflow = 'visible';
          }.bind(this));

        } else {

          //Close the menu
          el.style.height = '0px';

          //Set the overflow to hidden so that animation works properly
          innerContainer.style.overflow = 'hidden';
        }
      }
    },

    _onNestedItemClick: function(e, index, menuItem) {
      if (this.props.onItemClick) this.props.onItemClick(e, index, menuItem);
    },

    _onItemClick: function(e, index) {
      if (this.props.onItemClick) this.props.onItemClick(e, index, this.props.menuItems[index]);
    },

    _onItemToggle: function(e, index, toggled) {
      if (this.props.onItemToggle) this.props.onItemToggle(e, index, this.props.menuItems[index], toggled);
    }

  });

  exports.Menu = Menu;

})(window.React, window.CssEvent, window.Dom, window.KeyLine, window.Classable, window.ClickAwayable, window.Paper, window.MenuItem, window);


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


(function(React, Classable, ClickAwayable, KeyLine, Paper, Icon, Manu, exports) {

  // var React = require('react'),
  //   Classable = require('./mixins/classable.js'),
  //   ClickAwayable = require('./mixins/click-awayable'),
  //   KeyLine = require('./utils/key-line.js'),
  //   Paper = require('./paper.jsx'),
  //   Icon = require('./icon.jsx'),
  //   Menu = require('./menu.jsx');

  var DropDownMenu = React.createClass({displayName: "DropDownMenu",

    mixins: [Classable, ClickAwayable],

    propTypes: {
      autoWidth: React.PropTypes.bool,
      onChange: React.PropTypes.func,
      menuItems: React.PropTypes.array.isRequired
    },

    getDefaultProps: function() {
      return {
        autoWidth: true
      };
    },

    getInitialState: function() {
      return {
        open: false,
        selectedIndex: this.props.selectedIndex || 0
      }
    },

    componentClickAway: function() {
      this.setState({ open: false });
    },

    componentDidMount: function() {
      if (this.props.autoWidth) this._setWidth();
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.hasOwnProperty('selectedIndex')) {
        this.setState({selectedIndex: nextProps.selectedIndex});
      }
    },

    render: function() {
      var classes = this.getClasses('mui-drop-down-menu', {
        'mui-open': this.state.open
      });

      return (
        React.createElement("div", {className: classes}, 
          React.createElement("div", {className: "mui-menu-control", onClick: this._onControlClick}, 
            React.createElement(Paper, {className: "mui-menu-control-bg", zDepth: 0}), 
            React.createElement("div", {className: "mui-menu-label"}, 
              this.props.menuItems[this.state.selectedIndex].text
            ), 
            React.createElement(Icon, {className: "mui-menu-drop-down-icon", icon: "navigation-arrow-drop-down"}), 
            React.createElement("div", {className: "mui-menu-control-underline"})
          ), 
          React.createElement(Menu, {
            ref: "menuItems", 
            autoWidth: this.props.autoWidth, 
            selectedIndex: this.state.selectedIndex, 
            menuItems: this.props.menuItems, 
            hideable: true, 
            visible: this.state.open, 
            onItemClick: this._onMenuItemClick})
        )
      );
    },

    _setWidth: function() {
      var el = this.getDOMNode(),
        menuItemsDom = this.refs.menuItems.getDOMNode();

      el.style.width = menuItemsDom.offsetWidth + 'px';
    },

    _onControlClick: function(e) {
      this.setState({ open: !this.state.open });
    },

    _onMenuItemClick: function(e, key, payload) {
      if (this.props.onChange && this.state.selectedIndex !== key) this.props.onChange(e, key, payload);
      this.setState({
        selectedIndex: key,
        open: false
      });
    }

  });

  exports.DropDownMenu = DropDownMenu;

})(window.React, window.Classable, window.ClickAwayable, window.KeyLine, window.Paper, window.Icon, window.Manu, window);

(function(React, Classable, EnhancedButton, Icon, Paper, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable.js');
  // var EnhancedButton = require('./enhanced-button.jsx');
  // var Icon = require('./icon.jsx');
  // var Paper = require('./paper.jsx');

  var RaisedButton = React.createClass({displayName: "RaisedButton",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      icon: React.PropTypes.string.isRequired,
      mini: React.PropTypes.bool,
      onMouseDown: React.PropTypes.func,
      onMouseUp: React.PropTypes.func,
      onMouseOut: React.PropTypes.func,
      onTouchEnd: React.PropTypes.func,
      onTouchStart: React.PropTypes.func,
      secondary: React.PropTypes.bool
    },

    getInitialState: function() {
      var zDepth = this.props.disabled ? 0 : 2;
      return {
        zDepth: zDepth,
        initialZDepth: zDepth
      };
    },

    render: function() {
      var $__0=
        
        
        
           this.props,icon=$__0.icon,mini=$__0.mini,secondary=$__0.secondary,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{icon:1,mini:1,secondary:1});
      var classes = this.getClasses('mui-floating-action-button', {
        'mui-is-mini': mini,
        'mui-is-secondary': secondary
      });

      return (
        React.createElement(Paper, {
          className: classes, 
          innerClassName: "mui-floating-action-button-inner", 
          zDepth: this.state.zDepth, 
          circle: true}, 

          React.createElement(EnhancedButton, React.__spread({},  other, 
            {className: "mui-floating-action-button-container", 
            onMouseDown: this._handleMouseDown, 
            onMouseUp: this._handleMouseUp, 
            onMouseOut: this._handleMouseOut, 
            onTouchStart: this._handleTouchStart, 
            onTouchEnd: this._handleTouchEnd}), 

            React.createElement(Icon, {
              className: "mui-floating-action-button-icon", 
              icon: this.props.icon})

          )
          
        )
      );
    },

    _handleMouseDown: function(e) {
      //only listen to left clicks
      if (e.button === 0) {
        this.setState({ zDepth: this.state.initialZDepth + 1 });
      }
      if (this.props.onMouseDown) this.props.onMouseDown(e);
    },

    _handleMouseUp: function(e) {
      this.setState({ zDepth: this.state.initialZDepth });
      if (this.props.onMouseUp) this.props.onMouseUp(e);
    },

    _handleMouseOut: function(e) {
      this.setState({ zDepth: this.state.initialZDepth });
      if (this.props.onMouseOut) this.props.onMouseOut(e);
    },

    _handleTouchStart: function(e) {
      this.setState({ zDepth: this.state.initialZDepth + 1 });
      if (this.props.onTouchStart) this.props.onTouchStart(e);
    },

    _handleTouchEnd: function(e) {
      this.setState({ zDepth: this.state.initialZDepth });
      if (this.props.onTouchEnd) this.props.onTouchEnd(e);
    }

  });

  exports.RaisedButton = RaisedButton;

})(window.React, window.Classable, window.EnhancedButton, window.Icon, window.Paper, window);

/** @jsx React.DOM */
(function(React, Classable, exports) {
  var classSet = React.addons.classSet;

  var Input = React.createClass({displayName: "Input",

    propTypes: {
      multiline: React.PropTypes.bool,
      inlinePlaceholder: React.PropTypes.bool,
      rows: React.PropTypes.number,
      inputStyle: React.PropTypes.string,
      error: React.PropTypes.string,
      description: React.PropTypes.string,
      placeholder: React.PropTypes.string,
      type: React.PropTypes.string,
      onChange: React.PropTypes.func
    },

    mixins: [Classable],

    getInitialState: function() {
      return {
        value: this.props.defaultValue,
        rows: this.props.rows
      };
    },

    getDefaultProps: function() {
      return {
        multiline: false,
        type: "text"
      };
    },

    render: function() {
      var classes = this.getClasses('mui-input', {
        'mui-floating': this.props.inputStyle === 'floating',
        'mui-text': this.props.type === 'text',
        'mui-error': this.props.error || false,
        'mui-disabled': !!this.props.disabled,
      });
      var placeholder = this.props.inlinePlaceholder ? this.props.placeholder : "";
      var inputIsNotEmpty = !!this.state.value;
      var inputClassName = classSet({
        'mui-is-not-empty': inputIsNotEmpty
      });
      var textareaClassName = classSet({
        'mui-input-textarea': true,
        'mui-is-not-empty': inputIsNotEmpty
      });
      var inputElement = this.props.multiline ?
        this.props.valueLink ?
          React.createElement("textarea", React.__spread({},  this.props, {ref: "input", 
            className: textareaClassName, 
            placeholder: placeholder, 
            rows: this.state.rows})) :
          React.createElement("textarea", React.__spread({},  this.props, {ref: "input", 
            value: this.state.value, 
            className: textareaClassName, 
            placeholder: placeholder, 
            rows: this.state.rows, 
            onChange: this._onTextAreaChange})) :
          this.props.valueLink ?
            React.createElement("input", React.__spread({},  this.props, {ref: "input", 
              className: inputClassName, 
              placeholder: placeholder})) :
            React.createElement("input", React.__spread({},  this.props, {ref: "input", 
              className: inputClassName, 
              value: this.state.value, 
              placeholder: placeholder, 
              onChange: this._onInputChange}));
      var placeholderSpan = this.props.inlinePlaceholder ? null : 
        React.createElement("span", {className: "mui-input-placeholder", onClick: this._onPlaceholderClick}, 
          this.props.placeholder
        );

      return (
        React.createElement("div", {ref: this.props.ref, className: classes}, 
          inputElement, 
          placeholderSpan, 
          React.createElement("span", {className: "mui-input-highlight"}), 
          React.createElement("span", {className: "mui-input-bar"}), 
          React.createElement("span", {className: "mui-input-description"}, this.props.description), 
          React.createElement("span", {className: "mui-input-error"}, this.props.error)
        )
      );
    },

    getValue: function() {
      return this.state.value;
    },

    setValue: function(txt) {
      this.setState({value: txt});
    },

    clearValue: function() {
      this.setValue('');
    },

    blur: function() {
      if(this.isMounted()) this.refs.input.getDOMNode().blur();
    },
    
    focus: function() {
      if (this.isMounted()) this.refs.input.getDOMNode().focus();
    },

    _onInputChange: function(e) {
      var value = e.target.value;
      this.setState({value: value});
      if (this.props.onChange) this.props.onChange(e, value);
    },

    _onPlaceholderClick: function(e) {
      this.focus();
    },

    _onTextAreaChange: function(e) {
      this._onInputChange(e);
      this._onLineBreak(e);
    },

    _onLineBreak: function(e) {
      var value = e.target.value;
      var lines = value.split('\n').length;

      if (lines > this.state.rows) {
        if (this.state.rows !== 20) {
          this.setState({ rows: ((this.state.rows) + 1)});
        }
      }
    }

  });

  exports.Input = Input;

})(window.React, window.Classable, window);

(function(React, KeyCode, Classable, WindowListenable, Overlay, Paper, Menu, exports) {

  // var React = require('react'),
  //   KeyCode = require('./utils/key-code.js'),
  //   Classable = require('./mixins/classable.js'),
  //   WindowListenable = require('./mixins/window-listenable.js'),
  //   Overlay = require('./overlay.jsx'),
  //   Paper = require('./paper.jsx'),
  //   Menu = require('./menu.jsx');

  var LeftNav = React.createClass({displayName: "LeftNav",

    mixins: [Classable, WindowListenable],

    propTypes: {
      docked: React.PropTypes.bool,
      header: React.PropTypes.element,
      onChange: React.PropTypes.func,
      menuItems: React.PropTypes.array.isRequired,
      selectedIndex: React.PropTypes.number
    },

    windowListeners: {
      'keyup': '_onWindowKeyUp'
    },

    getDefaultProps: function() {
      return {
        docked: true
      };
    },

    getInitialState: function() {
      return {
        open: this.props.docked
      };
    },

    toggle: function() {
      this.setState({ open: !this.state.open });
      return this;
    },

    close: function() {
      this.setState({ open: false });
      return this;
    },

    open: function() {
      this.setState({ open: true });
      return this;
    },

    render: function() {
      var classes = this.getClasses('mui-left-nav', {
          'mui-closed': !this.state.open
        }),
        selectedIndex = this.props.selectedIndex,
        overlay;

      if (!this.props.docked) overlay = React.createElement(Overlay, {show: this.state.open, onTouchTap: this._onOverlayTouchTap});

      return (
        React.createElement("div", {className: classes}, 

          overlay, 
          React.createElement(Paper, {
            ref: "clickAwayableElement", 
            className: "mui-left-nav-menu", 
            zDepth: 2, 
            rounded: false}, 
            
            this.props.header, 
            React.createElement(Menu, {
              ref: "menuItems", 
              zDepth: 0, 
              menuItems: this.props.menuItems, 
              selectedIndex: selectedIndex, 
              onItemClick: this._onMenuItemClick})

          )
        )
      );
    },

    _onMenuItemClick: function(e, key, payload) {
      if (!this.props.docked) this.close();
      if (this.props.onChange && this.props.selectedIndex !== key) {
        this.props.onChange(e, key, payload);
      }
    },

    _onOverlayTouchTap: function() {
      this.close();
    },

    _onWindowKeyUp: function(e) {
      if (e.keyCode == KeyCode.ESC &&
          !this.props.docked &&
          this.state.open) {
        this.close();
      }
    }

  });

  exportsLeftNav = LeftNav;

})(window.React, window.KeyCode, window.Classable, window.WindowListenable, window.Overlay, window.Paper, window.Menu, window);

(function(React, Paper, Classable, exports) {

  // var React = require('react'),
  //     Paper = require('./paper.jsx'),
  //     Classable = require('./mixins/classable.js');

  var RadioButton = React.createClass({displayName: "RadioButton",

    mixins: [Classable],

    propTypes: {
      label: React.PropTypes.string,
      name: React.PropTypes.string,
      onClick: React.PropTypes.func,
      value: React.PropTypes.string,
      defaultChecked: React.PropTypes.bool
    },
    getDefaultProps: function(){
      return {
         defaultChecked: false
      }
    },
    getInitialState: function() {
      return {
        checked: this.props.defaultChecked
      }
    },

    toggle: function() {
      var radioButton = this.refs.radioButton.getDOMNode();

      this.setState({ checked: !this.state.checked });
      radioButton.checked = !radioButton.checked;
    },

    render: function() {
      var classes = this.getClasses('mui-radio-button');

      return (
        React.createElement("div", {className: classes, onClick: this._onClick}, 
          React.createElement("div", {className: "mui-radio-button-target"}, 
            React.createElement("input", {
              ref: "radioButton", 
              type: "radio", 
              name: this.props.name, 
              value: this.props.value, 
              defaultChecked: this.props.defaultChecked}
            ), 
            React.createElement("div", {className: "mui-radio-button-fill"})
            ), 
          React.createElement("span", {className: "mui-radio-button-label"}, this.props.label)
        )
      );
    },

    _onClick: function(e) {
      var checkedState = this.state.checked;

      this.toggle();
      if (this.props.onClick) this.props.onClick(e, !checkedState);
    }

  });

  exports.RadioButton = RadioButton;

})(window.React, window.Paper, window.Classable, window);

(function(React, Classable, EnhancedButton, Paper, exports) {

  // var React = require('react');
  // var Classable = require('./mixins/classable.js');
  // var EnhancedButton = require('./enhanced-button.jsx');
  // var Paper = require('./paper.jsx');

  var RaisedButton = React.createClass({displayName: "RaisedButton",

    mixins: [Classable],

    propTypes: {
      className: React.PropTypes.string,
      label: React.PropTypes.string.isRequired,
      onMouseDown: React.PropTypes.func,
      onMouseUp: React.PropTypes.func,
      onMouseOut: React.PropTypes.func,
      onTouchEnd: React.PropTypes.func,
      onTouchStart: React.PropTypes.func,
      primary: React.PropTypes.bool,
      secondary: React.PropTypes.bool
    },

    getInitialState: function() {
      var zDepth = this.props.disabled ? 0 : 1;
      return {
        zDepth: zDepth,
        initialZDepth: zDepth
      };
    },

    render: function() {
      var $__0=
        
        
        
           this.props,label=$__0.label,primary=$__0.primary,secondary=$__0.secondary,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{label:1,primary:1,secondary:1});
      var classes = this.getClasses('mui-raised-button', {
        'mui-is-primary': primary,
        'mui-is-secondary': !primary && secondary
      });

      return (
        React.createElement(Paper, {className: classes, zDepth: this.state.zDepth}, 
          React.createElement(EnhancedButton, React.__spread({},  other, 
            {className: "mui-raised-button-container", 
            onMouseUp: this._handleMouseUp, 
            onMouseDown: this._handleMouseDown, 
            onMouseOut: this._handleMouseOut, 
            onTouchStart: this._handleTouchStart, 
            onTouchEnd: this._handleTouchEnd}), 
            React.createElement("span", {className: "mui-raised-button-label"}, label)
          )
        )
      );
    },

    _handleMouseDown: function(e) {
      //only listen to left clicks
      if (e.button === 0) {
        this.setState({ zDepth: this.state.initialZDepth + 1 });
      }
      if (this.props.onMouseDown) this.props.onMouseDown(e);
    },

    _handleMouseUp: function(e) {
      this.setState({ zDepth: this.state.initialZDepth });
      if (this.props.onMouseUp) this.props.onMouseUp(e);
    },

    _handleMouseOut: function(e) {
      this.setState({ zDepth: this.state.initialZDepth });
      if (this.props.onMouseOut) this.props.onMouseOut(e);
    },

    _handleTouchStart: function(e) {
      this.setState({ zDepth: this.state.initialZDepth + 1 });
      if (this.props.onTouchStart) this.props.onTouchStart(e);
    },

    _handleTouchEnd: function(e) {
      this.setState({ zDepth: this.state.initialZDepth });
      if (this.props.onTouchEnd) this.props.onTouchEnd(e);
    }

  });

  exports.RaisedButton = RaisedButton;

})(window.React, window.Classable, window.EnhancedButton, window.Paper, window);

(function(React, Paper, Classable, Draggable, exports) {
  
var Slider = React.createClass({displayName: "Slider",

  propTypes: {
    required: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number,
    error: React.PropTypes.string,
    description: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onDragStart: React.PropTypes.func,
    onDragStop: React.PropTypes.func
  },

  mixins: [Classable],

  getDefaultProps: function() {
    return {
      required: true,
      disabled: false,
      defaultValue: 0,
      min: 0,
      max: 1,
      dragging: false
    };
  },

  getInitialState: function() {
    var value = this.props.value;
    if (value == null) value = this.props.defaultValue;
    var percent = value / this.props.max;
    if (isNaN(percent)) percent = 0;
    return {
      value: value,
      percent: percent
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value != null) {
      this.setValue(nextProps.value);
    }
  },

  render: function() {
    var classes = this.getClasses('mui-input', {
      'mui-error': this.props.error != null
    });

    var sliderClasses = this.getClasses('mui-slider', {
      'mui-slider-zero': this.state.percent == 0,
      'mui-disabled': this.props.disabled
    });

    var percent = this.state.percent;
    if (percent > 1) percent = 1; else if (percent < 0) percent = 0;

    return (
      React.createElement("div", {className: classes, style: this.props.style}, 
        React.createElement("span", {className: "mui-input-highlight"}), 
        React.createElement("span", {className: "mui-input-bar"}), 
        React.createElement("span", {className: "mui-input-description"}, this.props.description), 
        React.createElement("span", {className: "mui-input-error"}, this.props.error), 
        React.createElement("div", {className: sliderClasses, onClick: this._onClick}, 
          React.createElement("div", {ref: "track", className: "mui-slider-track"}, 
            React.createElement(Draggable, {axis: "x", bound: "point", 
              cancel: this.props.disabled ? '*' : null, 
              start: {x: (percent * 100) + '%'}, 
              onStart: this._onDragStart, 
              onStop: this._onDragStop, 
              onDrag: this._onDragUpdate}, 
              React.createElement("div", {className: "mui-slider-handle", tabIndex: 0})
            ), 
            React.createElement("div", {className: "mui-slider-selection mui-slider-selection-low", 
              style: {width: (percent * 100) + '%'}}, 
              React.createElement("div", {className: "mui-slider-selection-fill"})
            ), 
            React.createElement("div", {className: "mui-slider-selection mui-slider-selection-high", 
              style: {width: ((1 - percent) * 100) + '%'}}, 
              React.createElement("div", {className: "mui-slider-selection-fill"})
            )
          )
        ), 
        React.createElement("input", {ref: "input", type: "hidden", 
          name: this.props.name, 
          value: this.state.value, 
          required: this.props.required, 
          min: this.props.min, 
          max: this.props.max, 
          step: this.props.step})
      )
    );
  },

  getValue: function() {
    return this.state.value;
  },

  setValue: function(i) {
    // calculate percentage
    var percent = (i - this.props.min) / (this.props.max - this.props.min);
    if (isNaN(percent)) percent = 0;
    // update state
    this.setState({
      value: i,
      percent: percent
    });
  },

  getPercent: function() {
    return this.state.percent;
  },

  setPercent: function (percent) {
    var value = this._percentToValue(percent);
    this.setState({value: value, percent: percent});
  },

  clearValue: function() {
    this.setValue(0);
  },

  _onClick: function (e) {
    // let draggable handle the slider
    if (this.state.dragging || this.props.disabled) return;
    var value = this.state.value;
    var node = this.refs.track.getDOMNode();
    var boundingClientRect = node.getBoundingClientRect();
    var offset = e.clientX - boundingClientRect.left;
    this._updateWithChangeEvent(e, offset / node.clientWidth);
  },

  _onDragStart: function(e, ui) {
    this.setState({
      dragging: true
    });
    if (this.props.onDragStart) this.props.onDragStart(e, ui);
  },

  _onDragStop: function(e, ui) {
    this.setState({
      dragging: false
    });
    if (this.props.onDragStop) this.props.onDragStop(e, ui);
  },

  _onDragUpdate: function(e, ui) {
    if (!this.state.dragging) return;
    if (!this.props.disabled) this._dragX(e, ui.position.left);
  },

  _dragX: function(e, pos) {
    var max = this.refs.track.getDOMNode().clientWidth;
    if (pos < 0) pos = 0; else if (pos > max) pos = max;
    this._updateWithChangeEvent(e, pos / max);
  },

  _updateWithChangeEvent: function(e, percent) {
    if (this.state.percent === percent) return;
    this.setPercent(percent);
    var value = this._percentToValue(percent);
    if (this.props.onChange) this.props.onChange(e, value);
  },

  _percentToValue: function(percent) {
    return percent * (this.props.max - this.props.min) + this.props.min;
  }

});

  exports.Slider = Slider;

})(window.React, window.Paper, window.Classable, window.Draggable, window);

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

(function(React, Classable, exports) {
  
  // var React = require('react'),
  //   Classable = require('./mixins/classable.js');

  var TableHeader = React.createClass({displayName: "TableHeader",

    mixins: [Classable],

    propTypes: {
      headerItems: React.PropTypes.array.isRequired
    },

    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      var classes = this.getClasses('mui-table-header');

      return (
        React.createElement("div", {className: classes}, 
          this._getChildren(), 
          React.createElement("div", {className: "mui-table-header-pagify"}, 
            "(Pagify)"
          )
        )
      );
    },

    _getChildren: function() {
      var children = [],
        headerItem,
        itemComponent

      for (var i=0; i < this.props.headerItems.length; i++) {
        headerItem = this.props.headerItems[i];

        itemComponent = (
          React.createElement("div", {key: i, className: "mui-table-header-column"}, headerItem.text)
        );

        children.push(itemComponent);
      }

      return children;
    }

  });

  exports.TableHeader = TableHeader;

})(window.React, window.Classable, window);

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

/** @jsx React.DOM */
(function(React, Classable, exports) {

  // var Classable = require('./mixins/classable.js');
  // var React = require('react');

  var ToolbarGroup = React.createClass({displayName: "ToolbarGroup",

    propTypes: {
      float: React.PropTypes.string
    },

    mixins: [Classable],

    render: function() {

      var classes = this.getClasses('mui-toolbar-group', {
        'mui-left': this.props.float === 'left',
        'mui-right': this.props.float === 'right'
      });

      return (
        React.createElement("div", {className: classes}, 
          this.props.children
        )
      );
    }

  });

  exports.ToolbarGroup = ToolbarGroup;

})(window.React, window.Classable, window);

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

(function(React, Classable, exports) {

  // var React = require('react/addons');
  // var Classable = require('../mixins/classable');
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var SlideIn = React.createClass({displayName: "SlideIn",

    mixins: [Classable],

    propTypes: {
      direction: React.PropTypes.oneOf(['left', 'right', 'up', 'down'])
    },

    getDefaultProps: function() {
      return {
        direction: 'left'
      };
    },

    render: function() {
      var $__0=
        
        
        
        this.props,className=$__0.className,direction=$__0.direction,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,direction:1});
      var classes = this.getClasses('mui-transition-slide-in');

      classes += ' mui-is-' + this.props.direction;

      //Add a custom className to every child
      React.Children.forEach(this.props.children, function(child) {
        child.props.className = child.props.className ?
          child.props.className + ' mui-transition-slide-in-child':
          'mui-transition-slide-in-child';
      });

      return (
        React.createElement(ReactCSSTransitionGroup, React.__spread({},  other, 
          {className: classes, 
          transitionName: "mui-transition-slide-in", 
          component: "div"}), 
          this.props.children
        )
      );
    }

  });

  exports.SlideIn = SlideIn;

})(window.React, window.Classable, window);

(function(exports) {

  exports.DateTime = {

    addDays: function(d, days) {
      var newDate = this.clone(d);
      newDate.setDate(d.getDate() + days);
      return newDate;
    },

    addMonths: function(d, months) {
      var newDate = this.clone(d);
      newDate.setMonth(d.getMonth() + months);
      return newDate;
    },

    clone: function(d) {
      return new Date(d.getTime());
    },

    getDaysInMonth: function(d) {
      var resultDate = this.getFirstDayOfMonth(d);

      resultDate.setMonth(resultDate.getMonth() + 1);
      resultDate.setDate(resultDate.getDate() - 1);

      return resultDate.getDate();
    },

    getFirstDayOfMonth: function(d) {
      return new Date(d.getFullYear(), d.getMonth(), 1);
    },

    getFullMonth: function(d) {
      var month = d.getMonth();
      switch (month) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July';
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December';
      }
    },

    getShortMonth: function(d) {
      var month = d.getMonth();
      switch (month) {
        case 0: return 'Jan';
        case 1: return 'Feb';
        case 2: return 'Mar';
        case 3: return 'Apr';
        case 4: return 'May';
        case 5: return 'Jun';
        case 6: return 'Jul';
        case 7: return 'Aug';
        case 8: return 'Sep';
        case 9: return 'Oct';
        case 10: return 'Nov';
        case 11: return 'Dec';
      }
    },

    getDayOfWeek: function(d) {
      var dow = d.getDay();
      switch (dow) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
      }
    },

    getWeekArray: function(d) {
      var dayArray = [];
      var daysInMonth = this.getDaysInMonth(d);
      var daysInWeek;
      var emptyDays;
      var firstDayOfWeek;
      var week;
      var weekArray = [];

      for (var i = 1; i <= daysInMonth; i++) {
        dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
      };

      while (dayArray.length) {
        firstDayOfWeek = dayArray[0].getDay();
        daysInWeek = 7 - firstDayOfWeek;
        emptyDays = 7 - daysInWeek;
        week = dayArray.splice(0, daysInWeek);

        for (var i = 0; i < emptyDays; i++) {
          week.unshift(null);
        };

        weekArray.push(week);
      }

      return weekArray;
    },

    format: function(date) {
      var m = date.getMonth() + 1;
      var d = date.getDate();
      var y = date.getFullYear();
      return m + '/' + d + '/' + y;
    },

    isEqualDate: function(d1, d2) {
      return d1 && d2 &&
        (d1.getFullYear() === d2.getFullYear()) &&
        (d1.getMonth() === d2.getMonth()) &&
        (d1.getDate() === d2.getDate());
    },

    monthDiff: function(d1, d2) {
      var m;
      m = (d1.getFullYear() - d2.getFullYear()) * 12;
      m += d1.getMonth();
      m -= d2.getMonth();
      return m;
    }
  };

})(window);

(function(React, Classable, DateTime, EnhancedButton, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable.js');
  // var DateTime = require('../utils/date-time.js');
  // var EnhancedButton = require('../enhanced-button.jsx');

  var DayButton = React.createClass({displayName: "DayButton",

    mixins: [Classable],

    propTypes: {
      date: React.PropTypes.object,
      onTouchTap: React.PropTypes.func,
      selected: React.PropTypes.bool
    },

    render: function() {
      var $__0=
        
        
        
        
        
        this.props,className=$__0.className,date=$__0.date,onTouchTap=$__0.onTouchTap,selected=$__0.selected,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,date:1,onTouchTap:1,selected:1});
      var classes = this.getClasses('mui-date-picker-day-button', { 
        'mui-is-current-date': DateTime.isEqualDate(this.props.date, new Date()),
        'mui-is-selected': this.props.selected
      });

      return this.props.date ? (
        React.createElement(EnhancedButton, React.__spread({},  other, 
          {className: classes, 
          disableFocusRipple: true, 
          disableTouchRipple: true, 
          onTouchTap: this._handleTouchTap}), 
          React.createElement("div", {className: "mui-date-picker-day-button-select"}), 
          React.createElement("span", {className: "mui-date-picker-day-button-label"}, this.props.date.getDate())
        )
      ) : (
        React.createElement("span", {className: classes})
      );
    },

    _handleTouchTap: function(e) {
      if (this.props.onTouchTap) this.props.onTouchTap(e, this.props.date);
    }

  });

  exports.DayButton = DayButton;

})(window.React, window.Classable, window.DateTime, window.EnhancedButton, window);

(function(React, Classable, DateTime, DayButton, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable');
  // var DateTime = require('../utils/date-time.js');
  // var DayButton = require('./day-button.jsx');

  var CalendarMonth = React.createClass({displayName: "CalendarMonth",

    mixins: [Classable],

    propTypes: {
      displayDate: React.PropTypes.object.isRequired,
      onDayTouchTap: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired
    },

    render: function() {
      var classes = this.getClasses('mui-date-picker-calendar-month');

      return (
        React.createElement("div", {className: classes}, 
          this._getWeekElements()
        )
      );
    },

    _getWeekElements: function() {
      var weekArray = DateTime.getWeekArray(this.props.displayDate);

      return weekArray.map(function(week) {
        return (
          React.createElement("div", {className: "mui-date-picker-calendar-month-week"}, 
            this._getDayElements(week)
          )
        );
      }, this);
    },

    _getDayElements: function(week) {
      return week.map(function(day) {
        var selected = DateTime.isEqualDate(this.props.selectedDate, day);
        return (
          React.createElement(DayButton, {
            date: day, 
            onTouchTap: this._handleDayTouchTap, 
            selected: selected})
        );
      }, this);
    },

    _handleDayTouchTap: function(e, date) {
      if (this.props.onDayTouchTap) this.props.onDayTouchTap(e, date);
    }

  });

  exports.CalendarMonth = CalendarMonth;

})(window.React, window.Classable, window.DateTime, window.DayButton, window);

(function(React, DateTime, IconButton, SlideInTransitionGroup, exports) {

  // var React = require('react');
  // var DateTime = require('../utils/date-time.js');
  // var IconButton = require('../icon-button.jsx');
  // var SlideInTransitionGroup = require('../transition-groups/slide-in.jsx');

  var CalendarToolbar = React.createClass({displayName: "CalendarToolbar",

    propTypes: {
      displayDate: React.PropTypes.object.isRequired,
      onLeftTouchTap: React.PropTypes.func,
      onRightTouchTap: React.PropTypes.func
    },

    getInitialState: function() {
      return {
        transitionDirection: 'up'
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var direction;

      if (nextProps.displayDate !== this.props.displayDate) {
        direction = nextProps.displayDate > this.props.displayDate ? 'up' : 'down';
        this.setState({
          transitionDirection: direction
        });
      }
    },

    render: function() {
      var month = DateTime.getFullMonth(this.props.displayDate);
      var year = this.props.displayDate.getFullYear();

      return (
        React.createElement("div", {className: "mui-date-picker-calendar-toolbar"}, 

          React.createElement(SlideInTransitionGroup, {
            className: "mui-date-picker-calendar-toolbar-title", 
            direction: this.state.transitionDirection}, 
            React.createElement("div", {key: month + '_' + year}, month, " ", year)
          ), 

          React.createElement(IconButton, {
            className: "mui-date-picker-calendar-toolbar-button-left", 
            icon: "navigation-chevron-left", 
            onTouchTap: this.props.onLeftTouchTap}), 

          React.createElement(IconButton, {
            className: "mui-date-picker-calendar-toolbar-button-right", 
            icon: "navigation-chevron-right", 
            onTouchTap: this.props.onRightTouchTap})

        )
      );
    }

  });

  exports.CalendarToolbar = CalendarToolbar;

})(window.React, window.DateTime, window.IconButton, window.SlideInTransitionGroup, window);

(function(React, Classable, DateTime, SlideInTransitionGroup, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable.js');
  // var DateTime = require('../utils/date-time.js');
  // var SlideInTransitionGroup = require('../transition-groups/slide-in.jsx');

  var DateDisplay = React.createClass({displayName: "DateDisplay",

    mixins: [Classable],

    propTypes: {
      selectedDate: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {
        transitionDirection: 'up'
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var direction;

      if (nextProps.selectedDate !== this.props.selectedDate) {
        direction = nextProps.selectedDate > this.props.selectedDate ? 'up' : 'down';
        this.setState({
          transitionDirection: direction
        });
      }
    },

    render: function() {
      var $__0=
        
        
        this.props,selectedDate=$__0.selectedDate,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{selectedDate:1});
      var classes = this.getClasses('mui-date-picker-date-display');
      var dayOfWeek = DateTime.getDayOfWeek(this.props.selectedDate);
      var month = DateTime.getShortMonth(this.props.selectedDate);
      var day = this.props.selectedDate.getDate();
      var year = this.props.selectedDate.getFullYear();

      return (
        React.createElement("div", React.__spread({},  other, {className: classes}), 

          React.createElement(SlideInTransitionGroup, {
            className: "mui-date-picker-date-display-dow", 
            direction: this.state.transitionDirection}, 
            React.createElement("div", {key: dayOfWeek}, dayOfWeek)
          ), 

          React.createElement("div", {className: "mui-date-picker-date-display-date"}, 

            React.createElement(SlideInTransitionGroup, {
              className: "mui-date-picker-date-display-month", 
              direction: this.state.transitionDirection}, 
              React.createElement("div", {key: month}, month)
            ), 

            React.createElement(SlideInTransitionGroup, {
              className: "mui-date-picker-date-display-day", 
              direction: this.state.transitionDirection}, 
              React.createElement("div", {key: day}, day)
            ), 

            React.createElement(SlideInTransitionGroup, {
              className: "mui-date-picker-date-display-year", 
              direction: this.state.transitionDirection}, 
              React.createElement("div", {key: year}, year)
            )

          )

        )
      );
    }

  });

  exports.DateDisplay = DateDisplay;

})(window.React, window.Classable, window.DateTime, window.SlideInTransitionGroup, window);

(function(React, Classable, WindowListenable, DateTime, KeyCode, 
  CalendarMonth, CalendarToolbar, DateDisplay, SlideInTransitionGroup, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable.js');
  // var WindowListenable = require('../mixins/window-listenable.js');
  // var DateTime = require('../utils/date-time.js');
  // var KeyCode = require('../utils/key-code.js');
  // var CalendarMonth = require('./calendar-month.jsx');
  // var CalendarToolbar = require('./calendar-toolbar.jsx');
  // var DateDisplay = require('./date-display.jsx');
  // var SlideInTransitionGroup = require('../transition-groups/slide-in.jsx');

  var Calendar = React.createClass({displayName: "Calendar",

    mixins: [Classable, WindowListenable],

    propTypes: {
      initialDate: React.PropTypes.object,
      isActive: React.PropTypes.bool
    },

    windowListeners: {
      'keydown': '_handleWindowKeyDown'
    },

    getDefaultProps: function() {
      return {
        initialDate: new Date()
      };
    },

    getInitialState: function() {
      return {
        displayDate: DateTime.getFirstDayOfMonth(this.props.initialDate),
        selectedDate: this.props.initialDate,
        transitionDirection: 'left'
      };
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.initialDate !== this.props.initialDate) {
        var d = nextProps.initialDate || new Date();
        this.setState({
          displayDate: DateTime.getFirstDayOfMonth(d),
          selectedDate: d
        });
      }
    },

    render: function() {
      var weekCount = DateTime.getWeekArray(this.state.displayDate).length;
      var classes = this.getClasses('mui-date-picker-calendar', {
        'mui-is-4week': weekCount === 4,
        'mui-is-5week': weekCount === 5,
        'mui-is-6week': weekCount === 6
      });

      return (
        React.createElement("div", {className: classes}, 

          React.createElement(DateDisplay, {
            className: "mui-date-picker-calendar-date-display", 
            selectedDate: this.state.selectedDate}), 

          React.createElement("div", {
            className: "mui-date-picker-calendar-container"}, 
            React.createElement(CalendarToolbar, {
              displayDate: this.state.displayDate, 
              onLeftTouchTap: this._handleLeftTouchTap, 
              onRightTouchTap: this._handleRightTouchTap}), 

            React.createElement("ul", {className: "mui-date-picker-calendar-week-title"}, 
              React.createElement("li", {className: "mui-date-picker-calendar-week-title-day"}, "S"), 
              React.createElement("li", {className: "mui-date-picker-calendar-week-title-day"}, "M"), 
              React.createElement("li", {className: "mui-date-picker-calendar-week-title-day"}, "T"), 
              React.createElement("li", {className: "mui-date-picker-calendar-week-title-day"}, "W"), 
              React.createElement("li", {className: "mui-date-picker-calendar-week-title-day"}, "T"), 
              React.createElement("li", {className: "mui-date-picker-calendar-week-title-day"}, "F"), 
              React.createElement("li", {className: "mui-date-picker-calendar-week-title-day"}, "S")
            ), 

            React.createElement(SlideInTransitionGroup, {
              direction: this.state.transitionDirection}, 
              React.createElement(CalendarMonth, {
                key: this.state.displayDate.toDateString(), 
                displayDate: this.state.displayDate, 
                onDayTouchTap: this._handleDayTouchTap, 
                selectedDate: this.state.selectedDate})
            )
          )
        )
      );
    },

    getSelectedDate: function() {
      return this.state.selectedDate;
    },

    _addDisplayDate: function(m) {
      var newDisplayDate = DateTime.clone(this.state.displayDate);
      newDisplayDate.setMonth(newDisplayDate.getMonth() + m);
      this._setDisplayDate(newDisplayDate);
    },

    _addSelectedDays: function(days) {
      this._setSelectedDate(DateTime.addDays(this.state.selectedDate, days));
    },

    _addSelectedMonths: function(months) {
      this._setSelectedDate(DateTime.addMonths(this.state.selectedDate, months));
    },

    _setDisplayDate: function(d, newSelectedDate) {
      var newDisplayDate = DateTime.getFirstDayOfMonth(d);
      var direction = newDisplayDate > this.state.displayDate ? 'left' : 'right';

      if (newDisplayDate !== this.state.displayDate) {
        this.setState({
          displayDate: newDisplayDate,
          transitionDirection: direction,
          selectedDate: newSelectedDate || this.state.selectedDate
        });
      }
    },

    _setSelectedDate: function(d) {
      var newDisplayDate = DateTime.getFirstDayOfMonth(d);

      if (newDisplayDate !== this.state.displayDate) {
        this._setDisplayDate(newDisplayDate, d);
      } else {
        this.setState({
          selectedDate: d
        });
      }
    },

    _handleDayTouchTap: function(e, date) {
      this._setSelectedDate(date);
    },

    _handleLeftTouchTap: function() {
      this._addDisplayDate(-1);
    },

    _handleRightTouchTap: function() {
      this._addDisplayDate(1);
    },

    _handleWindowKeyDown: function(e) {
      var newSelectedDate;

      if (this.props.isActive) {

        switch (e.keyCode) {

          case KeyCode.UP:
            if (e.shiftKey) {
              this._addSelectedMonths(-1);
            } else {
              this._addSelectedDays(-7);
            }
            break;

          case KeyCode.DOWN:
            if (e.shiftKey) {
              this._addSelectedMonths(1);
            } else {
              this._addSelectedDays(7);
            }
            break;

          case KeyCode.RIGHT:
            if (e.shiftKey) {
              this._addSelectedMonths(1);
            } else {
              this._addSelectedDays(1);
            }
            break;

          case KeyCode.LEFT:
            if (e.shiftKey) {
              this._addSelectedMonths(-1);
            } else {
              this._addSelectedDays(-1);
            }
            break;

        }

      } 
    }

  });

  exports.Calendar = Calendar;


})(window.React, window.Classable, window.WindowListenable, window.DateTime, 
  window.KeyCode, window.CalendarMonth, window.CalendarToolbar, window.DateDisplay, 
  window.SlideInTransitionGroup, window);

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
      var $__0=
        
        
        
        this.props,initialDate=$__0.initialDate,onAccept=$__0.onAccept,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{initialDate:1,onAccept:1});
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

(function(React, Classable, WindowListenable, DateTime, KeyCode, DatePickerDialog, Input, exports) {

  // var React = require('react');
  // var Classable = require('../mixins/classable.js');
  // var WindowListenable = require('../mixins/window-listenable.js');
  // var DateTime = require('../utils/date-time.js');
  // var KeyCode = require('../utils/key-code.js');
  // var DatePickerDialog = require('./date-picker-dialog.jsx');
  // var Input = require('../input.jsx');

  var DatePicker = React.createClass({displayName: "DatePicker",

    mixins: [Classable, WindowListenable],

    propTypes: {
      defaultDate: React.PropTypes.object,
      formatDate: React.PropTypes.func,
      mode: React.PropTypes.oneOf(['portrait', 'landscape', 'inline']),
      onFocus: React.PropTypes.func,
      onTouchTap: React.PropTypes.func,
      onChange: React.PropTypes.func
    },

    windowListeners: {
      'keyup': '_handleWindowKeyUp'
    },

    getDefaultProps: function() {
      return {
        formatDate: DateTime.format
      };
    },

    getInitialState: function() {
      return {
        date: this.props.defaultDate,
        dialogDate: new Date()
      };
    },

    render: function() {
      var $__0=
        
        
        
        
        
        this.props,formatDate=$__0.formatDate,mode=$__0.mode,onFocus=$__0.onFocus,onTouchTap=$__0.onTouchTap,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{formatDate:1,mode:1,onFocus:1,onTouchTap:1});
      var classes = this.getClasses('mui-date-picker', {
        'mui-is-landscape': this.props.mode === 'landscape',
        'mui-is-inline': this.props.mode === 'inline'
      });
      var defaultInputValue;

      if (this.props.defaultDate) {
        defaultInputValue = this.props.formatDate(this.props.defaultDate);
      }

      return (
        React.createElement("div", {className: classes}, 
          React.createElement(Input, React.__spread({}, 
            other, 
            {ref: "input", 
            defaultValue: defaultInputValue, 
            onFocus: this._handleInputFocus, 
            onTouchTap: this._handleInputTouchTap})), 
          React.createElement(DatePickerDialog, {
            ref: "dialogWindow", 
            initialDate: this.state.dialogDate, 
            onAccept: this._handleDialogAccept})
        )

      );
    },

    getDate: function() {
      return this.state.date;
    },

    setDate: function(d) {
      this.setState({
        date: d
      });
      this.refs.input.setValue(this.props.formatDate(d));
    },

    _handleDialogAccept: function(d) {
      this.setDate(d);
      if (this.props.onChange) this.props.onChange(null, d);
    },

    _handleInputFocus: function(e) {
      e.target.blur();
      if (this.props.onFocus) this.props.onFocus(e);
    },

    _handleInputTouchTap: function(e) {
      this.setState({
        dialogDate: this.getDate()
      });

      this.refs.dialogWindow.show();
      if (this.props.onTouchTap) this.props.onTouchTap(e);
    },

    _handleWindowKeyUp: function(e) {
      //TO DO: open the dialog if input has focus
    }

  });

  exports.DatePicker = DatePicker;

})(window.React, window.Classable, window.WindowListenable, window.DateTime, window.KeyCode, 
  window.DatePicker, window.Input, window);

(function(React, Classable, TabTemplate, exports) {

  var Tab = React.createClass({displayName: "Tab",

    mixins: [Classable],

    propTypes: {
      handleTouchTap: React.PropTypes.func,
      selected: React.PropTypes.bool
    },


    handleTouchTap: function(){
      this.props.handleTouchTap(this.props.tabIndex, this);
    },

    render: function(){
      var styles = {
        width: this.props.width
      };

      var classes = this.getClasses('mui-tab-item', {
        'mui-tab-is-active': this.props.selected
      });

      return (
      React.createElement("div", {className: classes, style: styles, onTouchTap: this.handleTouchTap, routeName: this.props.route}, 
        this.props.label
      )
      )
    }

  });

  exports.Tab = Tab;

})(window.React, window.Classable, window.TabTemplate, window);
(function(React, exports) {

    var TabTemplate = React.createClass({displayName: "TabTemplate",

      render: function(){

        return (
          React.createElement("div", {className: "mui-tab-template"}, 
            this.props.children
          )
        );
      },
    });

    exports.TabTemplate = TabTemplate;

})(window.React, window);

(function(React, exports) {

  var InkBar = React.createClass({displayName: "InkBar",
    
    propTypes: {
      position: React.PropTypes.string
    },
    
    render: function() {

      var styles = {
        left: this.props.left,
        width: this.props.width
      }

      return (
        React.createElement("div", {className: "mui-ink-bar", style: styles}, 
          " "
        )
      );
    }

  });

  exports.InkBar = InkBar;

})(window.React, window);
(function(React, Tab, TabTemplate, InkBar, exports) {
  // var React = require('react');
  // var Tab = require('./tab.jsx');
  // var TabTemplate = require('./tabTemplate.jsx');
  // var InkBar = require('../ink-bar.jsx');

  var Tabs = React.createClass({displayName: "Tabs",

    propTypes: {
      onActive: React.PropTypes.func
    },

    getInitialState: function(){
      return {
        selectedIndex: 0
      };
    },

    getEvenWidth: function(){
      return (
        parseInt(window
          .getComputedStyle(this.getDOMNode())
          .getPropertyValue('width'), 10)
      );
    },

    componentDidMount: function(){
      if(this.props.tabWidth) {
        if(!(this.props.children.length * this.props.tabWidth > this.getEvenWidth())){
          this.setState({
            width: this.props.tabWidth,
            fixed: false
          });
          return;
        }
      }
      this.setState({
        width: this.getEvenWidth(),
        fixed: true
      });
    },

    handleTouchTap: function(tabIndex, tab){
      if (this.props.onChange && this.state.selectedIndex !== tabIndex) this.props.onChange();
      this.setState({selectedIndex: tabIndex});
      //default CB is _onActive. Can be updated in tab.jsx
      if(tab.props.onActive) tab.props.onActive(tab);
    },

    render: function(){
      var _this = this; 
      var width = this.state.fixed ?
        this.state.width/this.props.children.length :
        this.props.tabWidth;
      var left = width * this.state.selectedIndex || 0;
      var currentTemplate;
      var tabs = React.Children.map(this.props.children, function(tab, index){
        if(tab.type.displayName === "Tab"){
          if(_this.state.selectedIndex === index) currentTemplate = tab.props.children;
           return React.addons.cloneWithProps(tab, {
              key: index,
              selected: _this.state.selectedIndex === index,
              tabIndex: index,
              width: width,
              handleTouchTap: _this.handleTouchTap
            })
        } else {
          var type = tab.type.displayName || tab.type;
          throw "Tabs only accepts Tab Components as children. Found " + type + " as child number " + (index + 1) + " of Tabs";
        }
      });

      return (
        React.createElement("div", {className: "mui-tabs-container"}, 
          React.createElement("div", {className: "mui-tab-item-container"}, 
            tabs
          ), 
          React.createElement(InkBar, {left: left, width: width}), 
          React.createElement(TabTemplate, null, 
            currentTemplate
          )
        )
      )
    },

  });

  exports.Tabs = Tabs;

})(window.React, window.Tab, window.TabTemplate, window.InkBar, window);
