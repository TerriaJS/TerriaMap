var DataPreview = React.createClass({
  render: function() {
    return (<figure>
            <img src="http://placehold.it/600x300?text=preview"/>
            <figcaption>
            <div className="title clearfix">
            <h4 className="col col-6">Data title</h4>
            <ul className="list-reset flex col col-6 search-preview-action">
            <li><button className="btn" title ="share this data"><i className="fa fa-share-alt"></i></button></li>
            <li><button className="btn btn-primary" title ="add to map"><i className="fa fa-plus-circle"></i> Add to map</button></li>
            </ul>
            </div>
            <p>Some description about this data</p>
            </figcaption>
            </figure>
            );
  }
});
module.exports = DataPreview;
