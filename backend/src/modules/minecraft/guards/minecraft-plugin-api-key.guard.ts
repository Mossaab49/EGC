import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { timingSafeEqual } from 'crypto'
import { Request } from 'express'

@Injectable()
export class MinecraftPluginApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const providedKey = request.header('x-minecraft-api-key') ?? ''
    const expectedKey = this.config.get<string>('minecraft.apiKey', '')

    if (!providedKey || !expectedKey || !this.matches(providedKey, expectedKey)) {
      throw new UnauthorizedException('Invalid Minecraft API key')
    }

    return true
  }

  private matches(providedKey: string, expectedKey: string): boolean {
    const provided = Buffer.from(providedKey)
    const expected = Buffer.from(expectedKey)
    return provided.length === expected.length && timingSafeEqual(provided, expected)
  }
}
