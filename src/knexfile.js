const path = require('path')
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      charset: 'utf8',
      database: 'websips',
      user: 'chtira',
      password: 'chtira'
    },
    migrations: {
      directory: path.join(__dirname, '/migrations')
      // directory: './migrations'
    },
    seeds: {
      directory: path.join(__dirname, '/seeds')
      // directory: './seeds'
    }
  },
  migrations: {
    directory: path.join(__dirname, '/database/migrations')
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '/database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/database/production')
    }
  }
}
