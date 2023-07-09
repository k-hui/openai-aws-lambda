import { Injectable } from '@nestjs/common'
import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'

@Injectable()
export class ApiService {
  async speechToText(file: File): Promise<string> {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)
    // const file = fs.createReadStream(filename) as any
    const transcript = await openai.createTranscription(file, 'whisper-1')
    return transcript.data.text
  }
}
