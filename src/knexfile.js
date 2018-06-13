module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      charset: 'utf8',
      user: 'capsip',
      password: 'capsip',
      // port: process.env.DATABASE_PORT,
      // host: process.env.DATABASE_HOST,
      database: 'websiptest',
    }
  },
    migrations: {
      directory: __dirname + '/database/migrations',
    },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/database/migrations',
    },
    seeds: {
      directory: __dirname + '/database/production',
    },
  },
}
