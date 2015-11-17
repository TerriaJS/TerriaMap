var Legend = React.createClass({
  render: function() {
    return (
          <li className="now-viewing__item">
            <ul className="clearfix list-reset">
              <li className="col col-12"><button className="btn block"><h2 className="p">Electricity transmision lines</h2></button></li>
              <ul className="list-reset col col-12">
                <li className="col col-1"><button title="Data show/hide" className="btn"><i className="fa fa-eye"></i></button></li>
                <li className="col col-1"><button title="Zoom in data" className="btn"><i className="fa fa-square-o"></i></button></li>
                <li className="col col-1"><button title="Data information" className="btn"><i className="fa fa-info-circle"></i></button></li>
                <li className="col col-9 right-align"><button title="Remove this data" className="btn">Remove</button></li>
              </ul>
              <li className="col col-12">
                <label for="opacity">Opacity: </label>
                <input type="range" name="opacity"/>
              </li>
              <li className="col col-12">
                <a href="#"><img src="http://placehold.it/300x300?text=legends"/> </a>
              </li>
            </ul>
          </li>
        );
  }
});
module.exports = Legend;
