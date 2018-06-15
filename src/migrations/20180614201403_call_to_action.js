
exports.up = (knex, Promise) => {
  return knex.schema.createTable('call_to_action', (table) => {
    table.increments()
    table.timestamp('created_at').defaultTo(knex.fn.now()) /* ask clement for the default... utility*/
    table.string('title', 60)
    table.string('subtitle')
    table.string('image_url', 500)
    table.string('btn_text', 30)
    table.string('btn_link', 500)
    table.integer('sip_id').unsigned()

    table.foreign('sip_id').references('id').inTable('sips')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('call_to_action')
};
