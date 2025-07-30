module.exports = {
    apps: [{
      name: 'smartchangup-api',
      script: 'dist/src/index.js',
      cwd: '/home/bitnami/changupBar/packages/api',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_file: 'logs/combined.log',
      time: true
    }]
  }