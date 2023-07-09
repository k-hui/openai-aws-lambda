import { Injectable } from '@nestjs/common'
import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

@Injectable()
export class ApiService {
  async speechToText(filePath: string): Promise<string> {
    try {
      const openai = new OpenAIApi(configuration)
      const file = fs.createReadStream(filePath) as any
      // console.log(file)
      const transcript = await openai.createTranscription(file, 'whisper-1')
      return transcript.data.text
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
