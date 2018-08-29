
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          created_at: new Date(),
          email: 'emailtest@test.fr',
          password: 'nfjdoegrn',
          glide_id: 1
        },
        {
          id: 2,
          created_at: new Date(),
          email: 'alex@test.fr',
          password: 'nfjdoegrn',
          glide_id: 2
        }
      ])
    })
}
