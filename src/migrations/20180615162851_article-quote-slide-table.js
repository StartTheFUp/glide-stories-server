
exports.up = (knex, Promise) => {
  return knex.schema.createTable('slides_article_quote', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('article_url', 500)
    table.string('source_image', 500)
    table.string('source_name', 500)
    table.string('author_name', 500)
    table.string('text', 500)
    table.date('publication_date', 500)
    table.integer('sip_id').unsigned()
    table.foreign('sip_id').references('id').inTable('sips').onDelete('cascade').onUpdate('cascade')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('slides_article_quote')
}
