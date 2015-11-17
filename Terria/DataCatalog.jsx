var DataCatalogGroup = require('./DataCatalogGroup.jsx');
var DataPreview = require('./DataPreview.jsx');

var when = require('terriajs-cesium/Source/ThirdParty/when');


var DataCatalog = React.createClass({
  getInitialState: function() {
    return {
      openId: '',
      previewed: undefined
    };
  },

  componentDidMount: function(){
    var that = this;
    emitter.subscribe('preview', function(obj) { 
      that.setState({
        previewed: obj
      });
    });
  },

  handleChildClick: function (i, obj) {
    var that = this;
    obj.props.group.isOpen = !obj.state.isOpen;
    obj.setState({
      isOpen : !obj.state.isOpen
    });

    // if(obj.state.isOpen === false){
    //   when(obj.props.group.load()).then(function() {
    //     that.setState({
    //       openId : i
    //     });
    //   });
    // }
  },

  render: function(){
    var dataCatalog = this.props.catalog;
    var previewed = this.state.previewed
    return (
      <div className="panel-content clearfix">
      <div className="search-data col col-5">
      <ul className = 'list-reset'>
      {dataCatalog.map(function(group, i) {
        return (
          <DataCatalogGroup onClick={this.handleChildClick.bind(this, i)} group={group} items={group.items} isLoading={group.isLoading} key={i} />
        )
      }, this)}
      </ul>
      </div>
      <div className="search-preview preview col col-7 block">
        <DataPreview previewed = {previewed}/>
      </div>
      </div>
      ) ;
  }
});

module.exports = DataCatalog;
