import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Context, Handler } from 'aws-lambda'
import { RequestListener } from 'http'
import { AppModule } from './app.module'
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import express from 'express'
import { configure as serverlessExpress } from '@vendia/serverless-express'
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor'
import { isLocal } from './utils/env'
import { version } from '../package.json'

let cachedApp: RequestListener

function setupSwagger(app: INestApplication) {
  if (!isLocal) return
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Documentation')
    .setVersion(version)
    .build()
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  }
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Docs',
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('docs', app, document, customOptions)
}

async function bootstrapServer(): Promise<RequestListener> {
  if (!cachedApp) {
    const expressApp = express()
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        logger: ['error', 'warn', 'debug'],
        bodyParser: false,
      },
    )
    setupSwagger(nestApp)
    nestApp.enableCors()
    nestApp.use(express.json({ limit: '50mb' }))
    nestApp.use(express.urlencoded({ limit: '50mb', extended: true }))
    nestApp.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: false,
      }),
    )
    nestApp.useGlobalInterceptors(new LoggingInterceptor())
    nestApp.useGlobalInterceptors(new ErrorsInterceptor())
    nestApp.enableVersioning({
      type: VersioningType.URI,
    })
    await nestApp.init()
    cachedApp = expressApp
  }
  return cachedApp
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: any,
) => {
  const app = await bootstrapServer()
  const handler = serverlessExpress({
    app,
    binarySettings: {
      isBinary: true,
      contentTypes: ['audio/*', 'multipart/form-data'],
    },
  })
  return handler(event, context, callback)
}
