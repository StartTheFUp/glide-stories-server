const express = require('express')
const app = express()
const knex = require('./database/knex.js')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  res.json('Hello World')
})

app.get('/sips', (req, res) => {
  knex.select().from('sips')
    .then((sips) => {
      res.send(sips)
    })
})

app.listen(5000, () => console.log('Port 5000'))
