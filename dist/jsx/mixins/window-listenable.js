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
