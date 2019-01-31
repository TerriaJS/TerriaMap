import React from 'react';
import MenuButton from 'terriajs/lib/ReactViews/Map/MenuButton';

export default function AboutButton() {
    let theLink = "about.html";
    if (process.env.MAGDA_GATEWAY) {
        const webDomainName = window.location.hostname;
        const magdaGateway = process.env.MAGDA_GATEWAY;
        theLink = "http://" + magdaGateway + "/api/v0/content/" + webDomainName + "/about.html";
        console.debug("about ref = " + theLink);
    }

    return (<MenuButton caption="About" href={theLink} />)
};
