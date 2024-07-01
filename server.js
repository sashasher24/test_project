const express = require('express')
const app = express()
const userRouter = require('./routes/userRoutes')
const carRouter = require('./routes/carRoutes')
require('dotenv').config()

app.use(express.json())
app.use('/users', userRouter)
app.use('/cars', carRouter)

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

let server
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000
  server = app.listen(port, () => console.log(`SERVER STARTED ON PORT ${port}`))
}

module.exports = { app, server }