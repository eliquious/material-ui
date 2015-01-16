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