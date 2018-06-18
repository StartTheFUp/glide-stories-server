
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('slides_text').del()
    .then(() => {
      // Inserts seed entries
      return knex('slides_text').insert([
        {
          id: 1,
          created_at: new Date(),
          text: 'text titre',
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
          text: 'fkenzlmrizoas titre 3',
          sip_id: 1
        }
      ])
    })
}
