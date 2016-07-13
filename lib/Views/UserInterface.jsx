import React from 'react';

import version from '../../version';

import StandardUserInterface from 'terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx';
import MenuItem from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem';
import MenuPanel from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel';
import { Menu } from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups';

import './global.scss';

export default function UserInterface(props) {
    return (
        <StandardUserInterface {... props} version={version}>
            <Menu>
                <MenuItem caption="About" href="about.html" key="about-link"/>
                <MenuPanel btnText="Custom Panel">
                    <h1>This is a custom panel!</h1>
                </MenuPanel>
            </Menu>
        </StandardUserInterface>
    );
}