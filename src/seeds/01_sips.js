
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('sips').del()
    .then( () => {
      // Inserts seed entries
      return knex('sips').insert([
        {
          id: 1,
          type: "intro",
          title: "Art review",
          subtitle: "Life in Motion — Egon Schiele and Francesca Woodman, Tate Liverpool",
          image: "http://cosmetotheque.com/wp-content/uploads/2018/04/mario-gogh-589733-unsplash-1200x385.jpg"
        },
        {
          id: 2,
          type: "text",
          text: "Of all the galleries in the Tate empire, the one that seems most comfortable in its own skin is Tate Liverpool."
        },
        {
          id: 3,
          type: "image",
          text: "The rest are an increasingly dysfunctional bunch. Poor Tate Britain appears psychologically incapable of doing what it was set up to do — to celebrate British art — and yearns, desperately, to be Tate Modern.",
          image: "http://capucineleclerc.com/images/bouteilles-parfum-colorees.jpg"
        },
        {
          id: 4,
          type: "text",
          text: "Tate Modern itself, meanwhile, has grown so unfeasibly huge, it is now a place you go for the foyers, not for the art."
        },
        {
          id: 5,
          type: "image",
          text: "As for Tate St Ives, there has never been a pressing reason for it to exist, and its fate, alas, is to fiddle away at the margins of art, being ignored. Tate Liverpool, however, goes from strength to strength. Everything works here. The Merseyside location is…",
          image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg"
        },
        {
          id: 6,
          type: "image",
          text: "As for Tate St Ives, there has never been a pressing reason for it to exist, and its fate, alas, is to fiddle away at the margins of art, being ignored. Tate Liverpool, however, goes from strength to strength. Everything works here. The Merseyside location is…",
          image: "http://www.ugluu.mn/wp-content/uploads/2018/03/los-mejores-perfumes-de-mujer.jpg"
        },
        {
          id: 7,
          type: "text",
          text: "Last Slide"
        }
      ]);
    });
};
