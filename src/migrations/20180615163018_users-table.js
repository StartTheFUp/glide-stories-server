
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('email')
    table.string('password', 500)
    table.integer('glide_id').unsigned()
    table.foreign('glide_id').references('id').inTable('glides').onDelete('cascade').onUpdate('cascade')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users')
}
