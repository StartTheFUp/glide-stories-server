
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('slides_image').del()
    .then(() => {
      // Inserts seed entries
      return knex('slides_image').insert([
        {
          id: 1,
          created_at: new Date(),
          text: 'Text 1',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          sip_id: 1
        },
        {
          id: 2,
          created_at: new Date(),
          text: 'Text 2',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          sip_id: 2
        },
        {
          id: 3,
          created_at: new Date(),
          text: 'Text 3',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          sip_id: 1
        }
      ])
    })
}
