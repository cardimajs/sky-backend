process.env.MONGO_CONNECTION_STRING = 'mongodb://localhost/sky_teste'
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')

const request = supertest.agent(app)

afterAll(async () => {
  await mongoose.connection.db.dropDatabase()
  mongoose.disconnect()
})

const usuario = {
  nome: 'Alexandre Cardim',
  email: 'cardimajs@gmail.com',
  senha: 'js23121805',
  telefones: [{ numero: '933047045', ddd: '11' }],
  token: ''
}

describe('Sign Up', () => {
  it('Criar novo usuario', async () => {
    const res = await request
      .post('/sign_up')
      .send(usuario)
    expect(res.statusCode).toEqual(200)
    expect(res.body.nome).toEqual(usuario.nome)
    expect(res.body.email).toEqual(usuario.email)
  })

  it('Requer usuário não existente', async () => {
    const res = await request
      .post('/sign_up')
      .send(usuario)
    expect(res.statusCode).toEqual(400)
  })
})

describe('Sign In', () => {
  it('Retornar usuário', async () => {
    const res = await request
      .post('/sign_in')
      .send({
        email: usuario.email,
        senha: usuario.senha
      })
    usuario.token = res.body.token
    expect(res.statusCode).toEqual(200)
    expect(res.body.nome).toEqual(usuario.nome)
    expect(res.body.email).toEqual(usuario.email)
  })

  it('Requerer senha correta', async () => {
    const res = await request
      .post('/sign_in')
      .send({
        email: usuario.email,
        senha: usuario.senha + '123'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body.mensagem).toEqual('Usuário e/ou senha inválidos')
  })

  it('Requerer usuário existente', async () => {
    const res = await request
      .post('/sign_in')
      .send({
        email: usuario.email + '.xasd',
        senha: usuario.senha
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body.mensagem).toEqual('Usuário e/ou senha inválidos')
  })

  it('Requerer usuário e senha corretos', async () => {
    const res = await request
      .post('/sign_in')
      .send({
        email: usuario.email + '.xasd',
        senha: usuario.senha + '123'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body.mensagem).toEqual('Usuário e/ou senha inválidos')
  })
})

describe('Buscar Usuario', () => {
  it('Requer token', async () => {
    const res = await request
      .get('/buscar_usuario')
    expect(res.statusCode).toEqual(401)
  })

  it('Retornar usuário', async () => {
    const res = await request
      .get('/buscar_usuario')
      .set('Authorization', 'Bearer ' + usuario.token)
    expect(res.statusCode).toEqual(200)
    expect(res.body.nome).toEqual(usuario.nome)
    expect(res.body.email).toEqual(usuario.email)
  })

  it('Requer token válido', async () => {
    const res = await request
      .get('/buscar_usuario')
      .set('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWViN2M4NjJhMmYzMDUyOTFlZDdhZjc3IiwiaWF0IjoxNTg5MTAyNjkwLCJleHAiOjE1ODkxMDQ0OTB9.Q7YN8VBzevyhlOLRUuEMFcwcHFolortynk20hri1AAZ')
    expect(res.statusCode).toEqual(401)
  })
})
