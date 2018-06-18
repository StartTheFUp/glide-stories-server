
exports.up = (knex, Promise) => {
  return knex.schema.createTable('sips', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('title')
    table.string('order')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('sips')
}
