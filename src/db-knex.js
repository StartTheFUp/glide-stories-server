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

const getSlidesByGlideId = (type, id) => knex
  .select()
  .table(type)
  .where('glide_id', id)

const flatten = (a, b) => a.concat(b)
const byOrder = (a, b) => a.order - b.order

const getGlide = async id => {
  const { order, ...glide } = await knex
    .select()
    .table('glides')
    .where('id', id)
    .first()

  glide.slides = (await Promise.all(slideTypesEntries
    .map(async ([type, tableName]) => {
      const slides = await getSlidesByGlideId(tableName, id)
      for (const slide of slides) {
        if (type === 'article') { slide.article_link = slide.article_url }
        slide.uid = `${type}-${slide.id}`
        slide.type = type
        slide.order = order.indexOf(slide.uid)
      }
      return slides
    })))
    .reduce(flatten, [])
    .sort(byOrder)
    .map(camelSnake)

  return glide
}

const getGlides = userId => knex
  .select('glides.*',
    ' slides_intro.title AS slidesIntroTitle',
    'slides_intro.created_at AS slidesIntroCreatedAt',
    'slides_intro.subtitle',
    'slides_intro.image_url AS imageUrl')
  .from('slides_intro')
  .innerJoin('glides', 'glides.id', 'slides_intro.glide_id')
  .where('user_id', userId)
  .then(result => [ ...result.reduce((m, s) => m.set(s.id, s), new Map()).values() ])

const updateGlideOrder = ({ id, order }) => knex('glides')
  .where('id', id)
  .update('order', order)

const createSlide = ({ type }, params) => knex(slideTypes[type])
  .returning('id')
  .insert(params)

const deleteSlide = (type, id) => knex(slideTypes[type])
  .where('id', id)
  .del()

const createGlide = async ({title, userId}) => {
  const [ glideId ] = await knex
    .returning('id')
    .insert({
      title,
      user_id: userId
    })
    .into('glides')

  const [ id ] = await knex
    .returning('id')
    .insert({
      title,
      subtitle: '',
      image_url: '',
      glide_id: glideId
    })
    .into('slides_intro')

  const uid = `intro-${id}`
  await knex('glides')
    .where('id', glideId)
    .update('order', uid)

  return {
    id: glideId,
    title,
    slides: [ { id, uid, glideId, title } ]
  }
}

const deleteGlide = id => knex('glides')
  .where('id', id)
  .del()

const setSlideImage = ({ type, id, image }) => knex(slideTypes[type])
  .where('id', id)
  .update('image_url', image)

const updateSlide = ({ type, id }, params) => knex(slideTypes[type])
  .where('id', id)
  .update(params)

const createUser = params => knex
  .returning('id')
  .insert(params)
  .into('users')

const updateUser = param => knex('users')
  .where('id', param.id)
  .update(param)

const getUsers = () => knex('users')
  .select()

const getUserByEmail = email => knex('users')
  .select()
  .where('email', email)
  .first()

const getArticleUrlBySlideId = id => knex('slides_article_quote')
  .select('article_url')
  .where('id', id)
  .first()

module.exports = {
  createSlide,
  updateSlide,
  getGlide,
  getGlides,
  createGlide,
  setSlideImage,
  updateGlideOrder,
  getUserByEmail,
  createUser,
  camelSnake,
  deleteSlide,
  deleteGlide,
  getUsers,
  updateUser,
  getArticleUrlBySlideId
}
