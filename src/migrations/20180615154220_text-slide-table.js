
exports.up = (knex, Promise) => {
  return knex.schema.createTable('slides_text', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('text', 300)
    table.integer('sip_id').unsigned()
    table.foreign('sip_id').references('id').inTable('sips')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('slides_text')
}
