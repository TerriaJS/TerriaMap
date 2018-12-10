import PropTypes from 'prop-types';
import React, { Fragment } from 'react';


/**
 * The partial component
 *
 * @disable-docs
 */
const Nav = ({ _body, _relativeURL, _ID  }) => (
	<Fragment>
    {_body.map((item)=>{return item})}
  </Fragment>
);

Nav.propTypes = {
	/**
	 * _body: (test)(12)
	 */
	_body: PropTypes.node.isRequired,
};

Nav.defaultProps = {};

export default Nav;
