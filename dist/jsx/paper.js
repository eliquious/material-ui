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
      var {
        className,
        circle,
        innerClassName,
        rounded,
        zDepth,
        ...other } = this.props,
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
