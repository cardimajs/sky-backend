const mongoose = require('../database')
const bcrypt = require('bcryptjs')

const validateEmail = function (email) {
  var re = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const TelefoneSchema = new mongoose.Schema({
  numero: {
    type: String,
    require: true
  },
  ddd: {
    type: String,
    required: true
  }
})

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: [validateEmail, 'Use um email valido']
  },
  senha: {
    type: String,
    required: true,
    select: false,
    min: 3
  },
  telefones: [TelefoneSchema],
  ultimo_login: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao'
  }
})

UsuarioSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
})

TelefoneSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
})

UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) {
    return next()
  }
  this.senha = await bcrypt.hash(this.senha, 10)
  next()
})

const Usuario = mongoose.model('Usuario', UsuarioSchema)

module.exports = Usuario
