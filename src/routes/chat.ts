import express from 'express'
import OpenAI from 'openai'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const router = express.Router()

router.get('/', (req, res) => {
  // TODO add a client token in the http headers
  if (req.headers) {
    //console.log(req.headers)
  }
})

router.post('/', (req, res) => {
  let data = req.body

  console.log(data)
  if (data.question) {
    openai.chat.completions.create({
      messages: [{role: 'user', content: data.question}],
      model: 'gpt-3.5-turbo'
    }).then(data => {
      res.json(data)
    }).catch((err) => {
      res.status(500).json(err)
    })
  }
})

module.exports = router