
exports.up = function (knex, Promise) {
  return knex.schema.alterTable('slides_tweet_quote', table => {
    table.timestamp('publication_date').alter()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('slides_tweet_quote', table => {
    table.date('publication_date').alter()
  })
}
