const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const connectionString = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost/sky'

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
})

module.exports = mongoose
