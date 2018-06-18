
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility */
    table.string('email')
    table.string('password', 500)
    table.integer('sip_id').unsigned()
    table.foreign('sip_id').references('id').inTable('sips').onDelete('cascade').onUpdate('cascade')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users')
}
