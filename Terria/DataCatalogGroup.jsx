var DataCatalogMember = require('./DataCatalogMember.jsx');
var DataCatalogGroup = React.createClass({
  getInitialState: function() {
    return {isOpen: false};
  },

  handleClick: function(event) {
    this.setState({isOpen: !this.state.isOpen});
  },

  componentWillUpdate: function(catalogGroup, state) {
    var group = catalogGroup.group;
    group.isOpen = state.isOpen;
  },

  shouldComponentUpdate: function(nextProps) {
    console.log(nextProps);
    return true;
  },

  render: function(){
    var group = this.props.group;
    var members = this.props.items;
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
