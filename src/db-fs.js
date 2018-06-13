const fs = require('fs')
const path = require('path')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const sipsDir = path.join(__dirname, 'database')

const readSip = () => {
  const filename = 'mock.json'
  const filepath = path.join(sipsDir, filename)

  return readFile(filepath, 'utf8').then(JSON.parse)
}

const addTweetSlide = newTweet => {
  const filename = 'mock.json'
  const filepath = path.join(sipsDir, filename)

  return readSip()
    .then(sip => {
      newTweet.id = sip.length + 1
      newTweet.type = 'tweet'
      newTweet.created_at = Date.now()

      sip.push(newTweet)

      return writeFile(filepath, JSON.stringify(sip, null, 2), 'utf8')
    })
}

module.exports = {
  addTweetSlide
}
