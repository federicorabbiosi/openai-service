require('dotenv').config()
const express = require('express')

const app = express()
const port = 3001

app.use(express.json())

app.get('/', (req, res) => {
  res.send('OpenAI Service')
})

const chatRouter = require('./routes/chat')
app.use('/chat', chatRouter)

app.listen(port, () => {
  console.log("Express listening on port " + port)
})