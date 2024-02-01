
import express from 'express'
import OpenAI from 'openai'
import fs from 'fs'
import TranscriptionRequest from '../model/TranscriptionRequest'

const openai = new OpenAI()

const router = express.Router()

router.get('/', (req, res) => {
  res.send("Transcription")
})

// https://platform.openai.com/docs/guides/speech-to-text
// mp3, mp4, mpeg, mpga, m4a, wav, and webm

// TEST
router.get('/audio1', (req, res) => {
  openai.audio.transcriptions.create({
    model: "whisper-1",
    file: fs.createReadStream("./src/mock/audio1.mp3")
  }).then(result => {
    res.json({result: result.text})
  })
})


router.post('/', (req, res) => {
  let data : TranscriptionRequest = req.body


  console.log(data)
  if (data.filePath) {
    openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(data.filePath)
    }).then(result => {
      res.json({result: result.text})
    })
  } else {
    res.status(400).send("Missing filePath")
  }

})

module.exports = router