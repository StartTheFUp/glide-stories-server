
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('slides_tweet_quote').del()
    .then(() => {
      // Inserts seed entries
      return knex('slides_tweet_quote').insert([
        {
          id: 1,
          created_at: new Date(),
          publication_date: 'Tue Jun 12 13:03:00 +0000 2018',
          tweet_url: 'https://twitter.com/languesFR/status/1006479461108338689',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          author_name: 'La Villette',
          author_screen_name: 'LaVillette',
          text: '#CloudGateDance \'des instants d’une rare poésie\' via @sceneweb https://t.co/dMDvRAZKqo https://t.co/oIpgAt8yQx',
          sip_id: 1
        },
        {
          id: 2,
          created_at: new Date(),
          publication_date: 'Mon Jun 11 13:02:00 +0000 2018',
          tweet_url: 'https://twitter.com/languesFR/status/1006479461108338689',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          author_name: 'La Villette2',
          author_screen_name: 'LaVillette2',
          text: '#CloudGateDance \'des instants d’une rare poésie\' via @sceneweb https://t.co/dMDvRAZKqo https://t.co/oIpgAt8yQx',
<<<<<<< HEAD
          sip_id: 2
=======
          sip_id: 1
>>>>>>> bcc38c51d274dc92dfb2df5f438af24a03812d54
        }
      ])
    })
}
