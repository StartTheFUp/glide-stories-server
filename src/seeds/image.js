
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
<<<<<<< HEAD
          sip_id: 2
=======
          sip_id: 1
>>>>>>> bcc38c51d274dc92dfb2df5f438af24a03812d54
        },
        {
          id: 2,
          created_at: new Date(),
          text: 'Text 2',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
<<<<<<< HEAD
          sip_id: 1
=======
          sip_id: 2
>>>>>>> bcc38c51d274dc92dfb2df5f438af24a03812d54
        },
        {
          id: 3,
          created_at: new Date(),
          text: 'Text 3',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
<<<<<<< HEAD
          sip_id: 2
=======
          sip_id: 1
>>>>>>> bcc38c51d274dc92dfb2df5f438af24a03812d54
        }
      ])
    })
}
