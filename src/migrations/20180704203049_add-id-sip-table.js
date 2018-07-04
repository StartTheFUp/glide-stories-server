
exports.up = function(knex, Promise) {
  return knex.schema.table('sips', table => {
    table.integer('userId')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('sips', table => {
    table.dropColumns('userId')
  })
}
