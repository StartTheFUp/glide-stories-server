
exports.up = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('glide_id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.integer('glide_id')
  })
}
