var SearchBox = React.createClass({
  render: function() {
    return (
      <form className="search-data-form relative">
      <label htmlFor="search" className="hide"> Type keyword to search </label>
      <i className="fa fa-search"></i>
      <input id="search" type="text" name="search" value="" className="search__field field" placeholder="Search"/>
      </form>
    );
  }
});
module.exports = SearchBox;
