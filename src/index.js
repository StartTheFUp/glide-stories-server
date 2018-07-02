const express = require('express')
const sip = require('./database/mock.json')
const db = require('./db-knex.js')

const config = require('./data/twitter_config.js')
const knex = require('./database/knex.js')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const Twitter = require('twitter-node-client').Twitter

const app = express()
const s3 = new aws.S3()
const twitter = new Twitter(config)

aws.config.update({
    secretAccessKey : ,
    accessKeyId: ,
    region :
})

const getTweet = id => new Promise((resolve, reject) => {
  twitter.getTweet({ id }, reject, resolve)
})

const metascraper = require('metascraper')
const got = require('got')

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
      console.log({ body : req.body })
      cb(null, file.originalname)
    }
  })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.array('upl',1), (req, res, next) => {
    console.log({ body : req.body })
    console.log({ file : req.files })
    res.send("Uploaded!")
})

const slideHandlers = {
  tweet: ({ type, sipId, tweetUrl }) => {
    const tweetId = tweetUrl.split('/').slice(-1).join('')

    return getTweet(tweetId)
      .then(JSON.parse)
      .then(tweet => db.addTweetSlide({
        publication_date: tweet.created_at,
        tweet_url: tweetUrl,
        image_url: tweet.user.profile_image_url_https,
        author_name: tweet.user.name,
        author_screen_name: tweet.user.screen_name,
        text: tweet.text,
        sip_id: sipId
      }))
  },
  article: ({ type, sipId, articleUrl}) => {
    return getMetadatas(articleUrl)
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
  },
}


app.post('/slides', (req, res, next) => {
  // create
  slideHandlers[req.body.type](req.body)
    .then(() => res.json('ok'))
    .catch(next)
})

app.post('/updateSip', (req, res, next) => {
  db.updateSip(req.body)
    .then(() => res.json('ok'))
})

app.delete('/slides/:id', (req, res, next) => {
  // delete
})

app.get('/sips', (req, res, next) => {
  db.getSips()
    .then(sips => res.send(sips))
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

app.post('/sips', (req, res, next) => {
  db.createSip(req.body.title)
    .then(ids => res.json(ids[0]))
    .catch(next)
})

app.listen(5000, () => console.log('Port 5000'))
