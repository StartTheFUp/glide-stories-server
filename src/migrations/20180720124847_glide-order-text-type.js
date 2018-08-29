
exports.up = function (knex, Promise) {
  return knex.schema.alterTable('glides', table => {
    table.text('order').alter()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('glides', table => {
    table.string('order').alter()
  })
}
