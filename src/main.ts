// only used for debugging purposes
import * as dotenv from 'dotenv'
dotenv.config()
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new ErrorsInterceptor())

  const port = process.env.PORT || 3000
  const server = await app.listen(port)
  server.setTimeout(60000)

  new Logger('boostrap').log(`Debugging server listening on port ${port}`)
}

bootstrap()
