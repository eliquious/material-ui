(function(React, exports) {

    var TabTemplate = React.createClass({displayName: "TabTemplate",

      render: function(){

        return (
          React.createElement("div", {className: "mui-tab-template"}, 
            this.props.children
          )
        );
      },
    });

    exports.TabTemplate = TabTemplate;

})(window.React, window);
