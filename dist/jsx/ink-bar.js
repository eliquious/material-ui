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