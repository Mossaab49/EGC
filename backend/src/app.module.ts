import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './modules/auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { EventsModule } from './modules/events/events.module'
import { MinecraftModule } from './modules/minecraft/minecraft.module'
import { RankingModule } from './modules/ranking/ranking.module'
import { TournamentsModule } from './modules/tournaments/tournaments.module'
import { UsersModule } from './modules/users/users.module'
import { WordleModule } from './modules/wordle/wordle.module'
import configuration from './config/configuration'
import { validateConfig } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateConfig,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    EventsModule,
    TournamentsModule,
    RankingModule,
    WordleModule,
    MinecraftModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
