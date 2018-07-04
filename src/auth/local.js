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

const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (token) {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        next(err)
      } else {
        req.token = decoded
        next()
      }
    })
  } else {
    next(Error('forbidden'))
  }
}

const setToken = (res, email) => res.set('x-access-token', jwt.sign({ email }, SECRET))
const createUser = async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 9)
  const { email } = req.body
  await db.createUser({ password, email })
  setToken(res, email)
  return { message: 'account created' }
}

// Highway to hell
const login = (req, res) => new Promise((s, f) =>
  passport.authenticate('local', { session: false }, (authErr, user, info) => {
    if (authErr) return f(authErr)
    if (!user) return f(Error('¯\\_(ツ)_/¯')) // faire un truc mieux
    return req.login(user, { session: false }, loginErr => {
      if (loginErr) return f(loginErr)
      setToken(res, user.email)
      s({ message: 'login successfull' })
    })
  })(req, res))

module.exports = {
  login,
  createUser,
  verifyJWT
}