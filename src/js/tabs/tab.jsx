(function(React, Classable, TabTemplate, exports) {

  var Tab = React.createClass({

    mixins: [Classable],

    propTypes: {
      handleTouchTap: React.PropTypes.func,
      selected: React.PropTypes.bool
    },


    handleTouchTap: function(){
      this.props.handleTouchTap(this.props.tabIndex, this);
    },

    render: function(){
      var styles = {
        width: this.props.width
      };

      var classes = this.getClasses('mui-tab-item', {
        'mui-tab-is-active': this.props.selected
      });

      return (
      <div className={classes} style={styles} onTouchTap={this.handleTouchTap} routeName={this.props.route}>
        {this.props.label}
      </div>
      )
    }

  });

  exports.Tab = Tab;

})(window.React, window.Classable, window.TabTemplate, window);