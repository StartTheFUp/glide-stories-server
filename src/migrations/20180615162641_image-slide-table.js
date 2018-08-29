
exports.up = (knex, Promise) => {
  return knex.schema.createTable('slides_image', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('text', 120)
    table.string('image_url', 500)
    table.integer('glide_id').unsigned()
    table.foreign('glide_id').references('id').inTable('glides').onDelete('cascade').onUpdate('cascade')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('slides_image')
}
