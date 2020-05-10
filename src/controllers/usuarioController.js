const express = require('express')
const authMiddleware = require('../middlewares/auth')
const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
  res.send(req.usuario)
})

module.exports = app => app.use('/buscar_usuario', router)
