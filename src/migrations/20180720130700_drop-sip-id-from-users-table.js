
exports.up = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('sip_id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', table => {
    table.integer('sip_id')
  })
}
