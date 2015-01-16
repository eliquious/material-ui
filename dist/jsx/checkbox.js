
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
