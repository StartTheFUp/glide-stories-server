const knex = require('./database/knex.js')
const _ = require('lodash')

const slideTypes = {
  text: 'slides_text',
  intro: 'slides_intro',
  image: 'slides_image',
  tweet: 'slides_tweet_quote',
  article: 'slides_article_quote',
  callToAction: 'slides_call_to_action'
}
const slideTypesEntries = Object.entries(slideTypes)

const camelSnake = obj => _.mapKeys(obj, (value, key) => _.camelCase(key))
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

const getSips = () => knex.select().from('sips')

const getSlidesIntro = () => knex.select().from('slides_intro')

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
    .map(camelSnake)
  return sip
}

const getSipOrder = id => knex
  .select('order')
  .from('sips')
  .where('id', id)

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
  .map(camelSnake)
  // .then(console.log)

const addSlide = (slideType, slide) => knex(slideType).insert(slide)

const addTweetSlide = slide => {
  // id generated automatically with auto increment
  slide.created_at = new Date()

  return addSlide('slides_tweet_quote', slide)
}

const addArticleQuoteSlide = slide => {
  slide.created_at = new Date()

  return addSlide('slides_article_quote', slide)
}

const createSip = title => knex
  .returning('id')
  .insert({
    title: title,
    order: ''
  })
  .into('sips')

const updateSlide = {
  text: (slide) => knex
    .select()
    .from(slideTypes[slide.type])
    .where('id', slide.id)
    .update('text', slide.text),

  intro: (slide) => knex
    .select()
    .from(slideTypes[slide.type])
    .where('id', slide.id)
    .update('title', slide.title)
    .update('subtitle', slide.subtitle)
    .update('image_url', slide.imageUrl),

  image: (slide) => knex
    .select()
    .from(slideTypes[slide.type])
    .where('id', slide.id)
    .update('image_url', slide.imageUrl)
    .update('text', slide.text),

  tweet: (slide) => knex
    .select()
    .from(slideTypes[slide.type])
    .where('id', slide.id)
    .update('tweet_url', slide.tweetUrl)
    .update('author_name', slide.authorName)
    .update('author_screen_name', slide.authorScreenName)
    .update('text', slide.text)
    .update('image_url', slide.imageUrl)
    .update('publication_date', slide.publicationDate),

  article: (slide) => knex
    .select()
    .from(slideTypes[slide.type])
    .where('id', slide.id)
    .update('article_url', slide.articleUrl)
    .update('author_name', slide.authorName)
    .update('publication_date', slide.publicationDate)
    .update('source_name', slide.source)
    .update('source_image', slide.sourceImage)
    .update('text', slide.text),

  callToAction: (slide) => knex
    .select()
    .from(slideTypes[slide.type])
    .where('id', slide.id)
    .update('title', slide.title)
    .update('subtitle', slide.subtitle)
    .update('image_url', slide.imageUrl)
    .update('btn_text', slide.btnText)
    .update('btn_link', slide.btnLink),
}

const test = (slide) => {
  console.log(slide)
  return updateSlide[slide.type](slide)
}

module.exports = {
  addSlide,
  addTweetSlide,
  addArticleQuoteSlide,
  getSip,
  getSips,
  createSip,
  test,
}
