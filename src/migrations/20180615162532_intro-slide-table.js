
exports.up = (knex, Promise) => {
  return knex.schema.createTable('slides_intro', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('title', 60)
    table.string('subtitle')
    table.string('image_url', 500)
    table.integer('sip_id').unsigned()

    table.foreign('sip_id').references('id').inTable('sips').onDelete('cascade').onUpdate('cascade')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('slides_intro')
}
