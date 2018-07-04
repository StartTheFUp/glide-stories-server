const db = require('../db-knex.js')

const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET || 'pouet2'
const localOpts = {
  usernameField: 'email',
  passwordField: 'password',
}

const loginError = { message: 'Incorrect email or password.' }

passport.use(new LocalStrategy(localOpts, (email, password, next) => {
  db.getUserByEmail(email)
    .then(async user => {
      if (!user) return next(null, false, loginError)
      if (await bcrypt.compare(password, user.password)) return next(null, user)
      next(null, false, loginError)
    }, next)
}))

const tokenParser = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) return next()
  jwt.verify(token, SECRET, (err, decoded) => {
    if (!err) {
      req.token = decoded
    }
    next()
  })
}

const requireToken = (req, res, next) =>
  next(req.token ? null : Error('forbidden'))

const createUser = async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 9)
  const { email } = req.body
  const [ id ] = await db.createUser({ password, email })
  return { message: 'account created', token: jwt.sign({ email, id }, SECRET) }
}

// Highway to hell
const login = (req, res) => new Promise((s, f) =>
  passport.authenticate('local', { session: false }, (authErr, user, info) => {
    if (authErr) return f(authErr)
    if (!user) return f(Error('¯\\_(ツ)_/¯')) // faire un truc mieux
    return req.login(user, { session: false }, loginErr => {
      if (loginErr) return f(loginErr)
      const { email, id } = user
      s({ message: 'login successfull', token: jwt.sign({ email, id }, SECRET) })
    })
  })(req, res))

module.exports = {
  login,
  createUser,
  tokenParser,
  requireToken
}
