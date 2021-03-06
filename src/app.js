const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('./controllers/authController')(app)
require('./controllers/usuarioController')(app)

app.use(function (req, res, next) {
  res.status(404).json({ mensagem: 'Endpoint não encontrado' })
})

module.exports = app
