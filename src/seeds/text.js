
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('slides_text').del()
    .then(() => {
      // Inserts seed entries
      return knex('slides_text').insert([
        {
          id: 1,
          created_at: new Date(),
          text: 'Of all the galleries in the Tate empire, the one that seems most comfortable in its own skin is Tate Liverpool.',
          sip_id: 1
        },
        {
          id: 2,
          created_at: new Date(),
          text: 'text fdaf titre 2',
          sip_id: 2
        },
        {
          id: 3,
          created_at: new Date(),
          text: 'Tate Modern itself, meanwhile, has grown so unfeasibly huge, it is now a place you go for the foyers, not for the art.',
          sip_id: 1
        }
      ])
    })
}
