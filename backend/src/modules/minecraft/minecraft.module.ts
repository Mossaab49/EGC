import { Module } from '@nestjs/common'
import { MinecraftController } from './minecraft.controller'
import { MinecraftPluginController } from './minecraft-plugin.controller'
import { MinecraftPluginRepository } from './minecraft-plugin.repository'
import { MinecraftPluginService } from './minecraft-plugin.service'
import { MinecraftService } from './minecraft.service'

@Module({
  controllers: [MinecraftController, MinecraftPluginController],
  providers: [MinecraftService, MinecraftPluginService, MinecraftPluginRepository],
})
export class MinecraftModule {}
