const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const Usuario = require('../models/usuario')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send({ mensagem: 'Não autorizado' })
  }

  const parts = authHeader.split(' ')

  if (!parts.length === 2) {
    return res.status(401).send({ mensagem: 'Não autorizado' })
  }

  const [bearer, token] = parts

  if (!bearer === 'Bearer') {
    return res.status(401).send({ mensagem: 'Não autorizado' })
  }

  jwt.verify(token, authConfig.secret, { ignoreExpiration: true, complete: true }, async (err, decoded) => {
    if (err) return res.status(401).send({ mensagem: 'Não autorizado' })

    const usuario = await Usuario.findOne({ _id: decoded.payload.user_id })

    if (!usuario) {
      return res.status(401).send({ mensagem: 'Não autorizado' })
    }

    if (!(token === usuario.token)) {
      return res.status(401).send({ mensagem: 'Não autorizado' })
    }

    if (decoded.payload.exp < (new Date().getTime() + 1) / 1000) {
      return res.status(401).send({ mensagem: 'Sessão inválida' })
    }

    req.usuario = usuario

    return next()
  })
}
