import {
  Controller,
  Headers,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { ApiService } from './api.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

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
  speechToText(
    @Headers('host') host: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log(file)
    return this.apiService.speechToText(file)
  }
}
