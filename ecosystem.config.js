/*global __dirname*/
const path = require('path');

// Pass through additional arguments that might ultimately have come from
// something like `yarn start -- --port 3009`
const argpos = process.argv.indexOf('--');
const args = argpos > -1 ? process.argv.slice(argpos + 1) : [];

module.exports = {
  apps : [{
    name: path.basename(__dirname),
    script: require.resolve('terriajs-server'),

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // passed to app, so any valid arguments in options.js are allowed.
    args: args.join(' '),
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
