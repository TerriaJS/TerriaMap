var DataCatalog = require('./DataCatalog.jsx');

function getName(str1, str2){
  return str1.concat(str2)
}

var Tabs = React.createClass({
  clickTab: function(event){
    console.log(event);
  },

  render: function() {
    var items = ['welcome', 'data-catalog', 'collections' , 'my-data' ];
    return (
      <div className="tabs clearfix">
      <ul className="tablist center list-reset mb0" role="tablist">

      {items.map(function(item, i ){
      return (<li onClick={this.clickTab} key={i} id={getName('tablist__', item)} className={getName('btn tablist__', item)} role="tab" aria-controls={getName('panel__', item)} aria-selected="true" tabIndex="0">{item.replace(/-/g, ' ')}</li>)
        })}

      </ul>
      <section id="panel__welcome" className="tab-panel panel__welcome" aria-labelledby="tablist__welcome" role="tabpanel" tabIndex="0">       
        <h3 className="hide">Welcome</h3>
        <div className="panel-content">Welcome to <a href="#"> national map </a></div>
      </section> 

      <section id="panel__data-catalogue" className="tab-panel panel__data-catalogue" aria-labelledby="tablist__data-catalogue" role="tabpanel" aria-hidden="true" tabIndex="0" > 
      <DataCatalog catalog={this.props.catalog} />
      </section>
       <section id="panel__collections" className="tab-panel panel__collections" aria-labelledby="tablist__collections" role="tabpanel" aria-hidden="true" tabIndex="0" >        
        <h3 className="hide">Collections</h3>
        <div className="panel-content">List of collections</div>
      </section>

      <section id="panel__my-data" className="tab-panel panel__my-data" aria-labelledby="tablist__my-data" role="tabpanel" aria-hidden="true" tabIndex="0">        
        <h3 className="hide">My data</h3>
        <div className="panel-content">My data</div>
      </section>
      </div>);
  }
});
module.exports = Tabs;
