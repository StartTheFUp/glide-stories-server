const express = require('express')
const db = require('./db-knex.js')
const got = require('got')
const config = require('./data/twitter_config.js')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const metascraper = require('metascraper')
const Twitter = require('twitter-node-client').Twitter
const bodyParser = require('body-parser')
const app = express()
const twitter = new Twitter(config)

aws.config.update({
  secretAccessKey: 'svQm/6UJPrzjgazOYXMcdeaA5BXT7/drD9PcEIZ3',
  accessKeyId: 'AKIAJHBZMIGCPJ3Q6AEA',
  region: 'eu-west-3'
})

const s3 = new aws.S3()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const getTweet = id => new Promise((resolve, reject) => {
  twitter.getTweet({ id }, reject, resolve)
})

const getMetadatas = async articleUrl => {
  const { body: html, url } = await got(articleUrl)
  const metadata = await metascraper({ html, url })
  return metadata
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: 'websips',
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})

app.get('/', (req, res) => {
  res.json('Hello World !')
})

app.post('/slide/:type/:id', upload.array('image', 1), (req, res, next) => {
  console.log(req.body)
  const [ { location } ] = req.files
  db.setSlideImage({ type: req.params.type, id: req.params.id, image: location })
    .then(() => res.json({ url: location }))
    .catch(next)
})

const slideHandlers = {
  tweet: ({ sipId, url }) => {
    const tweetId = url.split('/').slice(-1).join('')

    return getTweet(tweetId)
      .then(JSON.parse)
      .then(tweet => db.addTweetSlide({
        publication_date: tweet.created_at,
        tweet_url: url,
        image_url: tweet.user.profile_image_url_https,
        author_name: tweet.user.name,
        author_screen_name: tweet.user.screen_name,
        text: tweet.text,
        sip_id: sipId
      }))
  },
  article: ({ sipId, url }) => {
    return getMetadatas(url)
      .then(metadatas => db.addArticleQuoteSlide({
        article_url: metadatas.url,
        author_name: metadatas.author,
        source_name: metadatas.publisher,
        source_image: metadatas.logo,
        text: '',
        sip_id: sipId
      }))
  },
  text: ({ sipId }) => {
    return db.addSlide('slides_text', {
      text: '',
      sip_id: sipId,
      created_at: new Date()
    })
  },
  image: ({ sipId }) => {
    return db.addSlide('slides_image', {
      text: '',
      image_url: '',
      sip_id: sipId,
      created_at: new Date()
    })
  },
  intro: ({ sipId }) => {
    return db.addSlide('slides_intro', {
      title: '',
      subtitle: '',
      image_url: '',
      sip_id: sipId,
      created_at: new Date()
    })
  },
  callToAction: ({ sipId }) => {
    return db.addSlide('slides_call_to_action', {
      title: '',
      subtitle: '',
      image_url: '',
      btn_text: '',
      btn_link: '',
      sip_id: sipId,
      created_at: new Date()
    })
  }
}

app.post('/slides', (req, res, next) => {
  // create
  slideHandlers[req.body.type](req.body)
    .then(() => res.json('ok'))
    .catch(next)
})

app.post('/slides/:id', (req, res, next) => {
  db.updateSlide({
    id: req.params.id,
    ...req.body
  })
    .then(() => res.json('ok'))
    .catch(next)
})

app.delete('/slides/:id', (req, res, next) => {
  // delete
})

app.get('/sips', (req, res, next) => {
  db.getSips()
    .then(sips => res.json(sips))
    .catch(next)
})

app.get('/preview', (req, res, next) => {
  db.getSlidesIntro()
    .then(slideintro => res.send(slideintro))
    .catch(next)
})

app.get('/sips/:id', (req, res, next) => {
  db.getSip(req.params.id)
    .then(sip => res.json(sip))
    .catch(next)
})

app.post('/sips/:id', (req, res, next) => {
  // update sip order
  const id = req.params.id
  const order = req.body.order
  console.log(order)

  db.updateSipOrder(id, order)
    .then(() => res.json('OK'))
    .catch(next)
})

app.post('/sips', (req, res, next) => {
  db.createSip(req.body.title)
    .then(ids => res.json(ids[0]))
    .catch(next)
})

app.listen(5000, () => console.log('Port 5000'))
