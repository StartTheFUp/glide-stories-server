
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
          article_url: 'http://www.elle.fr/People/La-vie-des-people/News/Johnny-Hallyday-les-fans-rassembles-a-la-Madeleine-pour-les-75-ans-du-rockeur',
          source_image: 'http://cdn-elle.ladmedia.fr/design/elle2/images/apple/touch-icon-ipad-retina.png',
          source_name: 'Elle',
          author_name: 'Elodie Petit',
          text: 'Type your extract here',
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
          sip_id: 2
        }
      ])
    })
}
