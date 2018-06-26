const express = require('express')
const sip = require('./database/mock.json')
const db = require('./db-fs.js')
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

app.get('/tweet', (req, res) => {
  getTweet('1006522254727892992')
    .then(tweet => JSON.parse(tweet))
    .then(tweet => {
      const newTweet = {
        publication_date: tweet.created_at,
        article_url: '', // put the link send by the user
        author_picture: tweet.user.profile_image_url_https,
        author_name: tweet.user.name,
        author_screen_name: tweet.user.screen_name,
        text: tweet.text
      }

      db.addTweetSlide(newTweet)
        .then(() => res.json('ok'))
        .catch(err => res.status(500).end(err.message))
    })
    .catch(console.error)
})

app.get('/mock', (req, res) => {
  res.json(sip)
})

app.get('/sips', (req, res) => {
  knex.select().from('sips')
    .then((sips) => {
      res.send(sips)
    })
})

app.listen(5000, () => console.log('Port 5000'))
