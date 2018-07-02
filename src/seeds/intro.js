
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('slides_intro').del()
    .then(() => {
      // Inserts seed entries
      return knex('slides_intro').insert([
        {
          id: 1,
          created_at: new Date(),
          title: 'Art review',
          image_url: 'http://cosmetotheque.com/wp-content/uploads/2018/04/mario-gogh-589733-unsplash-1200x385.jpg',
          subtitle: 'Life in Motion — Egon Schiele and Francesca Woodman, Tate Liverpool',
          sip_id: 1
        },
        {
          id: 2,
          created_at: new Date(),
          title: 'Test titre 2',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          subtitle: 'test sous titre 2',
          sip_id: 2
        },
        {
          id: 3,
          created_at: new Date(),
          title: 'Test titre 3',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          subtitle: 'test sous titre 3',
          sip_id: 2
        }
      ])
    })
}
