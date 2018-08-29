
exports.up = function (knex, Promise) {
  return knex.schema.table('glides', table => {
    table.integer('user_id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('glides', table => {
    table.dropColumn('user_id')
  })
}
