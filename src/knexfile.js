const path = require('path')
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      charset: 'utf8',
      user: 'capsip',
      password: 'capsip',
      database: 'websiptest'
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
