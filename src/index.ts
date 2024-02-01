import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
dotenv.config()

const app = express()
const chatRouter = require('./routes/chat')
const transcriptionRouter = require('./routes/transcription')

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('OpenAI Service')
})

app.use('/chat', chatRouter)
app.use('/transcription', transcriptionRouter)

const port = process.env.PORT

app.listen(port, () => {
  console.log("Express running and listening on port " + port)
})