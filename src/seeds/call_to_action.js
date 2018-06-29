
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('slides_call_to_action').del()
    .then(() => {
      // Inserts seed entries
      return knex('slides_call_to_action').insert([
        {
          id: 1,
          created_at: new Date(),
          title: 'Test titre',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          subtitle: 'test sous titre',
          btn_text: 'test btn',
          btn_link: 'https://twitter.com/languesFR/status/1006479461108338689',
          sip_id: 2
        },
        {
          id: 2,
          created_at: new Date(),
          title: 'Test titre 2',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          subtitle: 'test sous titre 2',
          btn_text: 'test btn2',
          btn_link: 'https://twitter.com/languesFR/status/1006479461108338689',
          sip_id: 2
        },
        {
          id: 3,
          created_at: new Date(),
          title: 'Buying GitHub Would Take Microsoft...',
          image_url: 'http://cosmetotheque.com/wp-content/uploads/2018/04/mario-gogh-589733-unsplash-1200x385.jpg',
          subtitle: 'Back to Its Root',
          btn_text: 'More info',
          btn_link: 'http://google.fr',
          sip_id: 1
        }
      ])
    })
}
