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
      var {
        className,
        date,
        onTouchTap,
        selected,
        ...other
      } = this.props;
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
