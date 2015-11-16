var DataCatalogItem = React.createClass({
  render: function(){
    var item = this.props.item;
    return ( 
      <li><button className="btn data-group__data-item">{item.name}<i className="fa fa-plus-circle"> </i></button></li>
      ) ;
  }
});

module.exports = DataCatalogItem;
