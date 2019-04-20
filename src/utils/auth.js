import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.password || !req.body.email) {
    return res.status(400).send({ message: 'Email and Password are required' })
  }
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.log(e)
    return res.status(400).end()
  }

}

export const signin = async (req, res) => {
  if (!req.body.password || !req.body.email) {
    return res.status(400).send({ message: 'Email and Password are required' })
  }

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(401).end()
  }
  try {
    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send({ message: 'Not auth' })
    }
  } catch (e) {
    return res.status(401).send({ message: 'Not auth' })
  }
}

export const protect = async (req, res, next) => {
  let token = req.headers.authorization.split('Bearer ')[1] //el headers pasa un 'Bearer $token" y el split un array
  if (!token) {
    return res.status(401).send({ message: 'no auth' })
  } 
  try {
    const payload = await verifyToken(token) 
    const user = await User.findById(payload.id)
  } catch (e) {
    console.log(e)
    return res.status(401).send({ message: 'no auth' })
  }
  next()
}
