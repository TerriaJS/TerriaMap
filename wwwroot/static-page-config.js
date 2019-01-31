module.exports = Object.freeze({
  appName: "TerriaMap",
  navItems: [
    {title: 'About', url: '/about.html'},
    {title: 'Help', url: '/help.html'},
    {title: 'FAQ', url: '/faq.html'},
    {title: 'Privacy', url: '/privacy.html'},
    {title: 'Launch Terriamap', url: 'https://nationalmap.gov.au/'}
  ],
  //markdown:  process.cwd() + "/wwwroot/markdown",
  dist: process.cwd() + "/wwwroot",
  footerCredit: "© Department of the Prime Minister and Cabinet, Department of Communications, and CSIRO Data61 2014-2017. All Rights Reserved"
});
