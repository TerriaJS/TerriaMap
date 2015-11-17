var SearchBox = require('./SearchBox.jsx');
var ModalTriggerButton = require('./ModalTriggerButton.jsx');

var btnAdd = "Add Data";
var btnRemove = "Remove All";

var SidePanel = React.createClass({


  render: function() {
    return (<div> <SearchBox />
          <div className="now-viewing">
            <ul className="now-viewing__control list-reset clearfix">
              <li className="now-viewing__add col col-6"><ModalTriggerButton btnText={btnAdd}/></li>
              <li className="now-viewing__remove col col-6 right-align"><ModalTriggerButton btnText={btnRemove}/></li>
            </ul>
            <ul className="now-viewing__content list-reset">
            </ul>
          </div>
        </div>
      );
  }
});
module.exports = SidePanel;
