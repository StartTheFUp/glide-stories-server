const db = require('../db-knex.js')

const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET || 'pouet2'
const localOpts = {
  usernameField: 'email',
  passwordField: 'password'
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
  if (req.token) {
    const params = { id: req.token.id }
    if (req.body.password) {
      params.password = await bcrypt.hash(req.body.password, 9)
    }
    if (req.body.email) {
      params.email = req.body.email
      await db.updateUser(params)
      return { message: 'account updated', email: params.email, token: jwt.sign({ email: params.email, id: params.id }, SECRET) }
    } else {
      await db.updateUser(params)
      return { message: 'account updated', token: req.headers['x-access-token'] }
    }
  } else {
    const password = await bcrypt.hash(req.body.password, 9)
    const { email } = req.body

    // error handling
    const users = await db.getUsers()
    const emails = users.map(user => user.email)
    const emailAlreadyExists = emails.some(emailDB => emailDB === email)

    if (emailAlreadyExists) {
      return { error: 'Email already exists' }
    }

    const [ id ] = await db.createUser({ password, email })
    return { message: 'account created', email, token: jwt.sign({ email, id }, SECRET) }
  }
}

// Highway to hell
const login = (req, res) => new Promise((resolve, reject) =>
  passport.authenticate('local', { session: false }, (authErr, user, info) => {
    if (authErr) return reject(authErr)
    if (!user) return reject(Error('Incorrect email or password')) // faire un truc mieux
    return req.login(user, { session: false }, loginErr => {
      if (loginErr) return reject(loginErr)
      const { email, id } = user
      resolve({ message: 'login successfull', email, token: jwt.sign({ email, id }, SECRET) })
    })
  })(req, res))

module.exports = {
  login,
  createUser,
  tokenParser,
  requireToken
}
