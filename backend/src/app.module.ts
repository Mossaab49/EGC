import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { EventsModule } from './modules/events/events.module'
import { MinecraftModule } from './modules/minecraft/minecraft.module'
import { RankingModule } from './modules/ranking/ranking.module'
import { TournamentsModule } from './modules/tournaments/tournaments.module'
import { UsersModule } from './modules/users/users.module'
import { WordleModule } from './modules/wordle/wordle.module'
import { validateConfig } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    EventsModule,
    TournamentsModule,
    RankingModule,
    WordleModule,
    MinecraftModule,
  ],
})
export class AppModule {}
