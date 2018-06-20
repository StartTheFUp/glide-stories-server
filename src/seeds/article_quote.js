
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('slides_article_quote').del()
    .then(() => {
      // Inserts seed entries
      return knex('slides_article_quote').insert([
        {
          id: 1,
          created_at: new Date(),
          publication_date: 'Tue Jun 13 13:03:00 +0000 2018',
          article_url: 'https://twitter.com/languesFR/status/1006479461108338689',
          source_image: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          source_name: 'Le monde',
          author_name: 'Alex kfjie',
          text: '#CloudGateDance \'des instants d’une rare poésie\' via @sceneweb https://t.co/dMDvRAZKqo https://t.co/oIpgAt8yQx',
          sip_id: 1
        },
        {
          id: 2,
          created_at: new Date(),
          publication_date: 'Mon Jun 12 13:03:00 +0000 2018',
          article_url: 'https://twitter.com/languesFR/status/1006479461108338689',
          source_image: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          source_name: 'ELLE',
          author_name: 'Pierre Kvongr',
          text: 'poésie\' via @sceneweb',
<<<<<<< HEAD
          sip_id: 2
=======
          sip_id: 1
>>>>>>> bcc38c51d274dc92dfb2df5f438af24a03812d54
        }
      ])
    })
}
