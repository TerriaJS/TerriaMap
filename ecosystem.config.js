/*global __dirname*/
const path = require('path');

module.exports = {
  apps : [{
    name: path.basename(__dirname),
    script: require.resolve('terriajs-server'),

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '--config-file devserverconfig.json',
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
