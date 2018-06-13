
exports.up = (knex, Promise) => {
  return knex.schema.createTable('sips', (table) => {
    table.increments()
    table.string('type').notNullable()
    table.string('title')
    table.string('subtitle')
    table.string('image', 500)
    table.string('text', 300)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('sips')
}
