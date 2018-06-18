
exports.up = (knex, Promise) => {
  return knex.schema.createTable('slides_tweet_quote', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('tweet_url', 500)
    table.string('author_name')
    table.string('author_screen_name')
    table.string('image_url', 500)
    table.string('text', 280) // limited by twitter
    table.date('publication_date')
    table.integer('sip_id').unsigned()

    table.foreign('sip_id').references('id').inTable('sips').onDelete('cascade').onUpdate('cascade')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('slides_tweet_quote')
}
