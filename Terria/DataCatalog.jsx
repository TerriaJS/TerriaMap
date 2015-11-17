var DataCatalogGroup = require('./DataCatalogGroup.jsx');
var when = require('terriajs-cesium/Source/ThirdParty/when');

var DataCatalog = React.createClass({
  getInitialState: function() {
    return {
      openId: ''
    };
  },

  handleChildClick: function (i, obj) {
    var that = this;
    obj.props.group.isOpen = !obj.state.isOpen;
    obj.setState({
      isOpen : !obj.state.isOpen
    });

    if(obj.state.isOpen === false){
      when(obj.props.group.load()).then(function() {
        that.setState({
          openId : i
        });
      });
    }
  },

  render: function(){
    var dataCatalog = this.props.catalog;
    return (
      <ul className = 'list-reset'>
      {dataCatalog.map(function(group, i) {
        return (
          <DataCatalogGroup onClick={this.handleChildClick.bind(this, i)} group={group} items={group.items} isLoading={group.isLoading} key={i} />
        )
      }, this)}
      </ul>
      ) ;
  }
});

module.exports = DataCatalog;
