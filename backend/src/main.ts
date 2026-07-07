import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const apiPrefix = config.get<string>('API_PREFIX', 'api/v1')
  const corsOrigin = config.get<string>('CORS_ORIGIN', 'http://localhost:5173')
  const port = config.get<number>('PORT', 4000)

  app.setGlobalPrefix(apiPrefix)
  app.enableCors({ origin: corsOrigin, credentials: true })
  app.use(helmet())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(port)
}

void bootstrap()
