const express = require('express')
const app = express()
const sip = require('./database/mock.json')
const db = require('./db-knex.js')

const config = require('./data/twitter_config.js')
const bodyParser = require('body-parser')

// MIDDLEWARES

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const Twitter = require('twitter-node-client').Twitter
const twitter = new Twitter(config)
const getTweet = id => new Promise((resolve, reject) => {
  twitter.getTweet({ id }, reject, resolve)
})

const metascraper = require('metascraper')
const got = require('got')

const getMetadatas = async targetUrl => {
  const { body: html, url } = await got(targetUrl)
  const metadata = await metascraper({ html, url })
  return metadata
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  res.json('Hello World')
})

app.get('/tweet', (req, res, next) => {
  getTweet('1009041135011090432')
    .then(JSON.parse)
    .then(tweet => db.addTweetSlide({
      publication_date: tweet.created_at,
      tweet_url: '', // put the link send by the user
      image_url: tweet.user.profile_image_url_https,
      author_name: tweet.user.name,
      author_screen_name: tweet.user.screen_name,
      text: tweet.text,
      sip_id: 2 // get sip_id
    }))
app.post('/slides', (req, res, next) => {
  // create
  slideHandlers[req.body.type](req.body)
    .then(() => res.json('ok'))
    .catch(next)
})


app.get('/article', (req, res, next) => {
  getMetadatas('http://www.elle.fr/People/La-vie-des-people/News/Johnny-Hallyday-les-fans-rassembles-a-la-Madeleine-pour-les-75-ans-du-rockeur')
    .then(metadatas => db.addArticleQuoteSlide({
      article_url: metadatas.url,
      author_name: metadatas.author,
      source_name: metadatas.publisher,
      source_image: metadatas.logo,
      text: '',
      sip_id: 2 // get the right sip id
    }))
    .then(() => res.json('ok'))
    .catch(next)
})

app.get('/mock', (req, res) => {
  res.json(sip)
})

app.get('/sips', (req, res, next) => {
  db.getSips()
    .then(sips => res.send(sips))
    .catch(next)
})

app.get('/sips/:id', (req, res, next) => {
  db.getSip(req.params.id)
    .then(sip => res.json(sip))
    .catch(next)
})

app.post('/sips', (req, res, next) => {
  db.createSip(req.body.title)
    .then(ids => res.json(ids[0]))
    .catch(next)
})

app.listen(5000, () => console.log('Port 5000'))
