import express from 'express'
import ChatRequest from 'model/ChatRequest'
import OpenAI from 'openai'
import fs from 'fs'
import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { pdfToString, saveTxtFromString } from '../utils'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const router = express.Router()

router.get('/', (req, res) => {
  // TODO add a client token in the http headers
  if (req.headers) {
    //console.log(req.headers)
  }
  res.send("Chat service")
})

router.get('/test', (req, res) => {
  getDataset('pagoparest').then((r) => {
    res.send(r)
  }).catch((err) => {
    res.status(400).send(err)
  })
})


/**
 * Generate ChatCompletionMessageParam Array that will be used as data base
 * TODO: If the file is not a txt create a .txt save it and put the original file on another backup folder
 * @param scope folder name inside /dataset containing file to add at our context
 * @returns 
 */
const getDataset = async (scope: string) : Promise<ChatCompletionMessageParam[]> => {
  const datasetPath = `./src/dataset/${scope ? scope : ''}`
  var files = fs.readdirSync(datasetPath)
  const dataset : ChatCompletionMessageParam[] = []

  const promises: any[] = []

  files.forEach(async fileName => {
    if (fileName.endsWith('.txt')) {
      promises.push(Promise.resolve(fs.readFileSync(`${datasetPath}/${fileName}`).toString()))
    } else if (fileName.endsWith('.pdf')) {
      promises.push(new Promise((resolve, reject) => {
        pdfToString(`${datasetPath}/${fileName}`).then(res => {
          resolve(res)

          // move the original pdf to .hidden folder and save a .txt file with the extracted content
          fs.renameSync(`${datasetPath}/${fileName}`, `${datasetPath}/.hidden/${fileName}`)

          fs.writeFileSync(`${datasetPath}/${fileName.substring(0, fileName.length - 4)}.txt`, res)
        }).catch((err) => {
          reject(err)
        })
      }))
    } else if (fileName.endsWith('.doc')) {
      // TODO
    } else {
      // file not supported
    }
  })

  return Promise.allSettled(promises).then((results : any) => {
    results.forEach((result: any) => {
      if (result.status === "fulfilled") {
        dataset.push({role: 'system', content: result.value})
      }
    })
    return dataset
  }).catch(() => {
    console.error('error')
    return []
  })

}

router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    let data : ChatRequest = req.body

    getDataset(data.scope || 'pileaweb').then((dataset) => {
      //console.log(dataset)

      if (data.question) {
        openai.chat.completions.create({
          messages: [
            {role: 'system', content: "Rispondi solo in base al context fornito e alle domande inerenti a " + data.scope},
            ...dataset,
            {role: 'user', content: data.question}],
          model: 'gpt-3.5-turbo'
        }).then(data => {
          console.log(JSON.stringify(data))
          res.json(data)
        }).catch((err) => {
          res.status(err.status || 500).json(err)
        })
      } else {
        throw 'Missing question'
      }
    }).catch((err) => {
      console.log("err_ " + err)
      throw err
    })

  } catch (err: any) {
    res.status(err?.status || 500).json(err)
  }
})

module.exports = router