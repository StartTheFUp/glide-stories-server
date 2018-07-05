const express = require('express')
const db = require('./db-knex.js')
const got = require('got')
const config = require('./data/twitter_config.js')
const auth = require('./auth/local.js')
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
app.use(auth.tokenParser)

const getTweet = id => new Promise((resolve, reject) => {
  twitter.getTweet({ id }, reject, resolve)
})

const awaitRoute = routeHandler => async (req, res, next) => {
  try {
    const result = await routeHandler(req, res)
    if (result !== undefined) {
      res.json(result)
    }
  } catch (err) {
    next(err)
  }
}

app.use((req, res, next) => {
  console.log(req.token)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token')
  next()
})

const upload = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'websips',
    key: (req, file, cb) => cb(null, file.originalname)
  })
})

const slideHandlers = {
  intro: {
    create: ({ sipId }) => ({
      title: '',
      subtitle: '',
      image_url: '',
      sip_id: sipId
    }),
    update: ({ title, subtitle }) => ({ title, subtitle })
  },

  text: {
    create: ({ sipId }) => ({
      text: '',
      sip_id: sipId
    }),
    update: ({ text }) => ({ text })
  },

  image: {
    create: ({ sipId }) => ({
      text: '',
      image_url: '',
      sip_id: sipId
    }),
    update: ({ text }) => ({ text })
  },

  tweet: {
    create: async ({ sipId, url }) => {
      const tweetId = url.split('/').slice(-1).join('')
      const tweet = JSON.parse(await getTweet(tweetId))

      return ({
        publication_date: tweet.created_at,
        tweet_url: url,
        image_url: tweet.user.profile_image_url_https,
        author_name: tweet.user.name,
        author_screen_name: tweet.user.screen_name,
        text: tweet.text,
        sip_id: sipId
      })
    },
    update: slide => ({
      tweet_url: slide.tweetUrl,
      author_name: slide.authorName,
      author_screen_name: slide.authorScreenName,
      text: slide.text,
      image_url: slide.imageUrl,
      publication_date: slide.publicationDate
    })
  },

  article: {
    create: async ({ sipId, url }) => {
      const { body } = await got(url)
      const metadatas = await metascraper({ html: body, url })

      return ({
        article_url: metadatas.url,
        author_name: metadatas.author,
        source_name: metadatas.publisher,
        source_image: metadatas.logo,
        text: '',
        sip_id: sipId
      })
    },
    update: slide => ({
      article_url: slide.articleUrl,
      author_name: slide.authorName,
      publication_date: slide.publicationDate,
      source_name: slide.source,
      source_image: slide.sourceImage,
      text: slide.text
    })
  },

  callToAction: {
    create: ({ sipId }) => ({
      title: '',
      subtitle: '',
      image_url: '',
      btn_text: '',
      btn_link: '',
      sip_id: sipId,
    }),
    update: slide => ({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.imageUrl,
      btn_text: slide.btnText,
      btn_link: slide.btnLink
    })
  }
}

app.post('/slide/:type/:id', auth.requireToken, upload.array('image', 1), awaitRoute(async req => {
  console.log(req.files)
  await db.setSlideImage({
    type: req.params.type,
    id: req.params.id,
    image: req.files
  })
  return { url: location }
}))

app.post('/slides', auth.requireToken, awaitRoute(async req => {
  const slide = req.body
  const params = await slideHandlers[slide.type].create(slide)
  const [ id ] = await db.createSlide(slide, params)
  return { id, ...db.camelSnake(params) }
}))

app.post('/slides/:id', auth.requireToken, awaitRoute(async req => {
  const slide = { ...req.params, ...req.body }
  const params = await slideHandlers[slide.type].update(slide)
  await db.updateSlide(slide, params)
  return 'ok'
}))

app.delete('/slides/:id', auth.requireToken, awaitRoute(async () => {}))
app.get('/sips', auth.requireToken, awaitRoute(req => db.getSips(req.token.id)))
app.get('/sips/:id', awaitRoute(req => db.getSip(req.params.id)))
app.post('/sips', auth.requireToken, awaitRoute(async req => db.createSip({ title: req.body.title, userId: req.token.id })))
app.post('/sips/:id', auth.requireToken, awaitRoute(req => db.updateSipOrder({
  ...req.params,
  ...req.body
})))


app.post('/users', awaitRoute(auth.createUser))
app.post('/auth/local', awaitRoute(auth.login))

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ error: err.message })
  } else {
    res.status(404).json({ error: 'Not Found' })
  }
})

app.listen(5000, () => console.log('Port 5000'))
