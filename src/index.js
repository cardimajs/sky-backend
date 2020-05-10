const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
