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
