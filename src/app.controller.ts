import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Response } from 'express'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('favicon.ico')
  @ApiExcludeEndpoint()
  getFavicon(@Res() res: Response) {
    res.status(HttpStatus.NO_CONTENT).send()
  }

  @Get('favicon-32x32.png')
  @ApiExcludeEndpoint()
  getFavicon32(@Res() res: Response) {
    res.status(HttpStatus.NO_CONTENT).send()
  }

  @Get('favicon-16x16.png')
  @ApiExcludeEndpoint()
  getFavicon16(@Res() res: Response) {
    res.status(HttpStatus.NO_CONTENT).send()
  }
}
