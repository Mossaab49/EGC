import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  const logger = new Logger('Bootstrap')
  const config = app.get(ConfigService)
  const nodeEnv = config.get<string>('app.env', 'development')
  const apiPrefix = config.get<string>('app.apiPrefix', 'api/v1')
  const frontendUrl = config.get<string>('app.frontendUrl', 'http://localhost:5173')
  const port = config.get<number>('app.port', 4000)
  const corsOrigin = nodeEnv === 'production'
    ? frontendUrl
    : [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173']

  app.use(helmet())
  app.use(json({ limit: '10mb' }))
  app.use(urlencoded({ extended: true, limit: '10mb' }))
  app.enableCors({ origin: corsOrigin, credentials: true })
  app.setGlobalPrefix(apiPrefix)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter(nodeEnv))
  app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(port)
  logger.log(`EGC API started on port ${port} in ${nodeEnv} mode`)
}

void bootstrap()
