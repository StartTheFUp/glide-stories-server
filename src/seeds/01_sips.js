
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('sips').del()
    .then(() => {
      // Inserts seed entries
      return knex('sips').insert([
        {
          id: 1,
          created_at: new Date(),
          title: 'Art review',
          order: 'intro-1 text-1 tweet-1 text-3 image-2 article-1 callToAction-3'
        },
        {
          id: 2,
          created_at: new Date(),
          title: 'Art review',
          order: 'intro-2 intro-3 article-2'
        }
      ])
    })
}
