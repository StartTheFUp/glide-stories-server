const knex = require('./database/knex.js')


const slideTypes = {
  text: 'slides_text',
  intro: 'slides_intro',
  image: 'slides_image',
  tweet: 'slides_tweet_quote',
  article: 'slides_article_quote',
  callToAction: 'slides_call_to_action',
}
const slideTypesEntries = Object.entries(slideTypes)
/*

const dbTypesToJS = jsTypesToDB)
  .reduce((acc, [value, key]) => {
    acc[key] = value
    return acc
  }, {})

const slideTypeValues = Object.values(jsTypesToDB)
*/

const getSlidesBySipId = (type, id) => knex
  .select()
  .table(type)
  .where('sip_id', id)

const getSlideById = (slideType, slideId) => knex
    .select()
    .table(slideType)
    .where('id', slideId)

const getSip = async id => {
  const { order, ...sip } = await knex
   .select()
   .table('sips')
   .where('id', id)
   .first()
  return sip
}


