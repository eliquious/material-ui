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
      var {
        className,
        direction,
        ...other
      } = this.props;
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

});(window.React, window.Classable, window)
