import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMinecraftRequestDto } from './dto/create-minecraft-request.dto'
import { UpdateMinecraftRequestStatusDto } from './dto/update-minecraft-request-status.dto'

type MinecraftRequest = CreateMinecraftRequestDto & {
  id: string
  status: 'Acceptee' | 'Refusee' | 'En attente'
}

const requests: MinecraftRequest[] = []

@Injectable()
export class MinecraftService {
  async findAll() {
    return requests
  }

  async create(dto: CreateMinecraftRequestDto) {
    const request: MinecraftRequest = {
      ...dto,
      id: `minecraft-${Date.now()}`,
      status: 'En attente',
    }
    requests.push(request)
    return request
  }

  async updateStatus(id: string, dto: UpdateMinecraftRequestStatusDto) {
    const request = requests.find((item) => item.id === id)
    if (!request) throw new NotFoundException('Minecraft request not found')
    request.status = dto.status
    return request
  }
}
