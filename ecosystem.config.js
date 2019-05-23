module.exports = {
   /**
    * Application configuration section
    * http://pm2.keymetrics.io/docs/usage/application-declaration/
    */
   apps: [
      // First application
      {
         name: 'todo-backend',
         script: 'dist/main.js',
         watch: true,
         env: {
            COMMON_VARIABLE: 'true',
            PORT: 5011
         },
         env_production: {
            NODE_ENV: 'production'
         }
      }
   ]
};
