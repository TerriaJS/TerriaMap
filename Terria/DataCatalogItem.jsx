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
      <li className="clearfix"><button onClick={this.addToPreview} className="btn data-group__data-item col col-10">{item.name}</button><button onClick={this.addToMap} className="btn blue col col-2"><i className="fa fa-plus-circle"> </i></button></li>
      ) ;
  }
});

module.exports = DataCatalogItem;
