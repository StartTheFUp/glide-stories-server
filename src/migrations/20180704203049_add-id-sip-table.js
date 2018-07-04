
exports.up = function(knex, Promise) {
  return knex.schema.table('sips', table => {
    table.integer('user_id')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('sips', table => {
    table.dropColumn('user_id')
  })
}
