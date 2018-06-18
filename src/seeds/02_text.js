
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(() => {
      // Inserts seed entries
      return knex('table_name').insert([
        {
          id: 1,
          text: 'Tate Modern itself, meanwhile, has grown so unfeasibly huge, it is now a place you go for the foyers, not for the art.',
          sip_id: 1
        },

        {
          id: 2,
          text: 'Tate Modern itself, meanwhile, has grown so unfeasibly huge, it is now a place you go for the foyers, not for the art.',
          sip_id: 1
        }
      ])
    })
}
