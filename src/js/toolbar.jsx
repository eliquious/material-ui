/** @jsx React.DOM */
(function(React, Classable, exports) {

  // var Classable = require('./mixins/classable.js');
  // var React = require('react');

  var Toolbar = React.createClass({

    mixins: [Classable],

    render: function() {
      var classes = this.getClasses('mui-toolbar', {
      });

      return (
        <div className={classes}>
          {this.props.children}
        </div>
      );
    }

  });

  exports.Toolbar = Toolbar;

})(window.React, window.Classable, window);
