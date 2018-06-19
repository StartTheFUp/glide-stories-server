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

const flatten = (a, b) => a.concat(b)
const byOrder = (a, b) => a.order - b.order
const getOrder = slides => slides.map(slide => slide.uid).join(' ')
const getSip = async id => {
  const { order, ...sip } = await knex
   .select()
   .table('sips')
   .where('id', id)
   .first()

  sip.slides = (await Promise.all(slideTypesEntries
    .map(async ([type, tableName]) => {
      const slides = await getSlidesBySipId(tableName, id)
      for (const slide of slides) {
        slide.uid = `${type}-${slide.id}`
        slide.type = type
        slide.order = order.indexOf(slide.uid)
      }
      return slides
    })))
    .reduce(flatten, [])
    .sort(byOrder)

  return sip
}

const getSipOrder = id => knex
  .select('order')
  .from('sips')
  .where('id', id)
/*
getSip(1).then(sip => console.log('sip :', getOrder(sip.slides)))
/**/

getSipOrder(1)
  .then(async sipOrder => (await Promise.all(sipOrder
      .map(order => order.order)
      .join(' ')
      .split(' ')
      .map(slide => {
        const [ type, id ] = slide.split('-')
        return getSlideById(slideTypes[type], id)
      })))
      .reduce(flatten, []))
  .then(console.log)
/**/
