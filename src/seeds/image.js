
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
          sip_id: 2
        },
        {
          id: 2,
          created_at: new Date(),
          text: 'Poor Tate Britain appears psychologically incapable of doing what it was set up to do.',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg',
          sip_id: 1
        },
        {
          id: 3,
          created_at: new Date(),
          text: 'Text 3',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          sip_id: 2
        }
      ])
    })
}
