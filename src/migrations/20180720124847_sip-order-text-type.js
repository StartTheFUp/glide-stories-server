
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('sips', table => {
    table.text('order').alter()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('sips', table => {
    table.string('order').alter()
  })
}
