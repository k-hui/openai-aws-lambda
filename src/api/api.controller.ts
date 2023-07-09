import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiService } from './api.service'
import { CreateApiDto } from './dto/create-api.dto'

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('speech-to-text')
  speechToText() {
    return this.apiService.speechToText()
  }
}
