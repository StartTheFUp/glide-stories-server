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

const getSlidesBySipId = (type, id) => knex
  .select()
  .table(type)
  .where('sip_id', id)

const flatten = (a, b) => a.concat(b)
const byOrder = (a, b) => a.order - b.order

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

const getSips = userId => knex
  .select('sips.*',
    ' slides_intro.title AS slidesIntroTitle',
    'slides_intro.created_at AS slidesIntroCreatedAt',
    'slides_intro.subtitle',
    'slides_intro.image_url AS imageUrl')
  .from('slides_intro')
  .innerJoin('sips', 'sips.id', 'slides_intro.sip_id')
  .where('user_id', userId)
  .then(result => [ ...result.reduce((m, s) => m.set(s.id, s), new Map()).values() ])

const updateSipOrder = ({ id, order }) => knex('sips')
  .where('id', id)
  .update('order', order)

const createSlide = ({ type }, params) => knex(slideTypes[type])
  .returning('id')
  .insert(params)

const deleteSlide = (type, id) => knex(slideTypes[type])
  .where('id', id)
  .del()

const createSip = async ({title, userId}) => {
  const [ sipId ] = await knex
    .returning('id')
    .insert({
      title,
      user_id: userId
    })
    .into('sips')

  const [ id ] = await knex
    .returning('id')
    .insert({
      title,
      subtitle: '',
      image_url: '',
      sip_id: sipId
    })
    .into('slides_intro')

  const uid = `intro-${id}`
  await knex('sips')
    .where('id', sipId)
    .update('order', uid)

  return {
    id: sipId,
    title,
    slides: [ { id, uid, sipId, title } ]
  }
}

const deleteSip = id => knex('sips')
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

const getUserByEmail = email => knex('users')
  .select()
  .where('email', email)
  .first()

module.exports = {
  createSlide,
  updateSlide,
  getSip,
  getSips,
  createSip,
  setSlideImage,
  updateSipOrder,
  getUserByEmail,
  createUser,
  camelSnake,
  deleteSlide,
  deleteSip,
  updateUser
}
