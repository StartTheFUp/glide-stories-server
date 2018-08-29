const path = require('path')
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      charset: 'utf8',
      database: 'glide-stories'
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
    directory: path.join(__dirname, '/migrations')
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/seeds')
    }
  }
}
