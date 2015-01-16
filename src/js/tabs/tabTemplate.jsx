(function(React, exports) {

    var TabTemplate = React.createClass({

      render: function(){

        return (
          <div className='mui-tab-template'>
            {this.props.children}
          </div>
        );
      },
    });

    exports.TabTemplate = TabTemplate;

})(window.React, window);
