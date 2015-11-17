var DataCatalogMember = require('./DataCatalogMember.jsx');
var when = require('terriajs-cesium/Source/ThirdParty/when');

var DataCatalogGroup = React.createClass({
  getInitialState: function() {
    return {
      isOpen: false,
      data: this.props
    };
  },

  handleClick: function(event) {
    event.preventDefault();
    this.setState({isOpen: !this.state.isOpen});
  },

  componentWillUpdate: function(catalogGroup, state) {
    var group = catalogGroup.group;

  },

  componentDidUpdate: function(obj) {
    //console.log(this.state.isOpen);
    if(obj.group.isOpen === false){
      obj.group.isOpen = this.state.isOpen;
      var that = this;
      when(obj.group.load()).then(function() {
        that.setState({
          data: obj
        });
      });
    }

    console.log(obj);
  },

  render: function(){
    var group = this.state.data.group;
    var members = this.state.data.items;
    var content='';
    var iconClass;

    if(this.state.isOpen === true){
      if(members && members.length > 0){
        content = members.map(function(member, i){return <DataCatalogMember member={member} items={member.items} key={i} />});
      } else{
        content = "Loading";
      }
    }

    iconClass = 'fa fa-chevron-' + (this.state.isOpen ? 'down' : 'right');
    return (
      <li>
        <button className ='btn' onClick={this.handleClick} > {group.name} <i className={iconClass}></i> </button>
        <ul className="data-catalog-group list-reset">
        {content}
        </ul>
      </li>
      );
  }
});

module.exports = DataCatalogGroup;
