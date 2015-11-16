var DataCatalogGroup = require('./DataCatalogGroup.jsx');
var DataCatalog = React.createClass({
  render: function(){
    var dataCatalog = this.props.catalog;
    var dataCatalog
    return (
      <ul className = 'list-reset'>
      {dataCatalog.map(function(group, i) {
        return (
          <DataCatalogGroup group={group} items={group.items} isLoading={group.isLoading} key={i} />
        )
      })}
      </ul>
      ) ;
  }
});

module.exports = DataCatalog;
