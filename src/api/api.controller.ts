import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { ApiService } from './api.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import fs from 'fs'

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('speech-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/tmp',
        filename: (req: any, file: any, cb: any) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  async speechToText(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    // const f1 = fs.readFileSync(file.path)
    // console.log(f1)
    // const f2 = fs.readFileSync('files/test.wav')
    // console.log(f2)
    return this.apiService.speechToText(file.path)
  }
}
