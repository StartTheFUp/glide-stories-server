const knex = require('./database/knex.js')

const getSlides = async slideType => {
  const slidesText = await knex
    .select().table(`${slideType}`)
    // .then(slides => console.log('slides :', slides))
    .catch(err => console.log(err))

  return slidesText
}

const getSip = async () => {
  const slidesText = await getSlides('slides_text')
  const slidesImage = await getSlides('slides_image')
  const slidesIntro = await getSlides('slides_intro')
  const slidesArticleQuote = await getSlides('slides_article_quote')
  const slidesTweetQuote = await getSlides('slides_tweet_quote')
  const slidesCallToAction = await getSlides('slides_call_to_action')

  const sip = {text: slidesText, image: slidesImage}

  return sip
}

getSip().then(sip => console.log('sip :', sip))

//
// let slidesText = []
// getSlidesText().then(slides => slidesText = slides))
