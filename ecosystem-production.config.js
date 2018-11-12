const dev = require('./ecosystem.config.js');
const os = require('os');

// You can start a production server with:
//    ./node_modules/.bin/pm2 start ecosystem-production.config.js --update-env --env production
// Or configure it to run automatically as a daemon (systemd, upstart, launchd, rcd) with:
//    ./node_modules/.bin/pm2 startup systemd

const devApp = dev.apps[0];

module.exports = {
    apps: [
        {
            ...devApp,
            name: devApp.name + '-production',
            args: '--config-file productionserverconfig.json',
            instances: Math.max(4, os.cpus().length)
        }
    ]
};