const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const authConfig = require('../config/auth')
const router = express.Router()

// em segundos
const tokenExpiresIn = 1800

router.post('/sign_up', async (req, res) => {
  const { email } = req.body
  try {
    if (await Usuario.findOne({ email })) {
      return res.status(400).send({ mensagem: 'E-mail já existente' })
    }

    const token = jwt.sign({ id: req.body.id }, authConfig.secret, {
      expiresIn: tokenExpiresIn
    })

    const usuario = await Usuario.create({ ...req.body, token })

    usuario.senha = undefined

    return res.send(usuario)
  } catch (err) {
    return res.status(400).send({ mensagem: 'Erro ao registrar usuário' })
  }
})

router.post('/sign_in', async (req, res) => {
  const { email, senha } = req.body

  const usuario = await Usuario.findOne({ email }).select('+senha')

  if (!usuario) {
    return res.status(401).send({ mensagem: 'Usuário e/ou senha inválidos' })
  }

  if (!await bcrypt.compare(senha, usuario.senha)) {
    return res.status(401).send({ mensagem: 'Usuário e/ou senha inválidos' })
  }

  const token = jwt.sign({ user_id: usuario.id }, authConfig.secret, {
    expiresIn: tokenExpiresIn
  })

  usuario.token = token
  usuario.ultimo_login = Date.now()
  await usuario.save()

  usuario.senha = undefined

  res.send(usuario)
})

module.exports = app => app.use('/', router)
