import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

/**
 * The Nav component
 */
const Nav = ({ links, _pages, _relativeURL, _ID }) => (
	<nav className="nav">
		<ul>
			{
				links.map( ( link, i ) => {
					const url = link.link;

					return (
						<li key={ i } className={`nav__link nav__link--generated${
							_pages[ _ID ]._url.startsWith( url ) && url != '/' || url === '/' && _ID === 'index'
								? ` nav__link--active`
								: ''
							}`}>
							<a href={
								url.startsWith('http')
									? url
									: _relativeURL( url, _ID )
							}>
								{link.name}
							</a>
						</li>
					);
				})
			}
		</ul>
	</nav>
);

Nav.propTypes = {
	links: PropTypes.array.isRequired,
};

Nav.defaultProps = {};

export default Nav;