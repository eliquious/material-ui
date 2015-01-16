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
