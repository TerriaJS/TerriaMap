var DataCatalogItem = React.createClass({
  
  getInitialState: function() {
    return {
      isPreviewed: false,
      isActive: false
    };
  },

  addToPreview: function(){
    this.setState({
      isPreviewed: true
    });
  },

  addToMap: function(){
    console.log('add to map');
    this.setState({
      isActive: true
    });
  },

  componentDidUpdate: function(){
    emitter.dispatch('preview', this.props.item);
  },

  render: function(){
    var item = this.props.item;
    return ( 
      <li><button onClick={this.addToPreview} className="btn data-group__data-item">{item.name}</button><button onClick={this.addToMap} className="btn blue"><i className="fa fa-plus-circle"> </i></button></li>
      ) ;
  }
});

module.exports = DataCatalogItem;
