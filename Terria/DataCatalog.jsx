var DataCatalogGroup = require('./DataCatalogGroup.jsx');
var DataCatalog = React.createClass({
  render: function(){
    var dataCatalog = this.props.catalog;
    return (
      <ul className = 'list-reset'>
      {dataCatalog.map(function(group, i) {
        return (
          <DataCatalogGroup group={group} key={i} />
        )
      })}
      </ul>
      ) ;
  }
});

module.exports = DataCatalog;
