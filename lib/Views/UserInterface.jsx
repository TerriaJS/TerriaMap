import React from 'react';

import version from '../../version';

import StandardUserInterface from 'terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx';
import MenuItem from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem';
import MenuPanel from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel';

import './global.scss';

export default function UserInterface(props) {
  return (
    <StandardUserInterface
      {... props}
      version={version}>
      <MenuItem caption="About" href="about.html"/>
    </StandardUserInterface>
  );
}