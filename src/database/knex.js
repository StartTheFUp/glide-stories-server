const config = require('../knexfile.js').development
module.exports = require('knex')(config)

