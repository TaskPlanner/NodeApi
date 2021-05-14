module.exports = {
  apps : [{
    script: './src/server.js'
  }],

  deploy : {
    production : {
      user : 'server930223',
      host : 'server930223.nazwa.pl',
      ref  : 'BackEnd_0.3',
      repo : '/home/server930223/ftp/app.server930223.nazwa.pl/git/.git',
      path : '/home/server930223/ftp/app.server930223.nazwa.pl/test2',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && /home/server930223/ftp/npm_global/node_modules/pm2/bin/pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
