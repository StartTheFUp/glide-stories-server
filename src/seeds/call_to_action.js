
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
          sip_id: 1
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
          title: 'Test titre 3',
          image_url: 'https://pbs.twimg.com/profile_images/685018005990993920/bQzEIcoY_normal.jpg',
          subtitle: 'test sous titre 3',
          btn_text: 'test btn3',
          btn_link: 'https://twitter.com/languesFR/status/1006479461108338689',
          sip_id: 1
        }
      ])
    })
}
