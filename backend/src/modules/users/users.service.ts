import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'

type UserRecord = {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Membre'
  points: number
  status: 'Actif' | 'Invite'
}

const users: UserRecord[] = [
  {
    id: 'user-admin',
    name: 'Mossaab Saouti',
    email: 'mossaab@etu.uae.ac.ma',
    role: 'Admin',
    points: 190,
    status: 'Actif',
  },
]

@Injectable()
export class UsersService {
  async findAll() {
    return users
  }

  async findByEmail(email: string) {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  async create(dto: CreateUserDto) {
    const user: UserRecord = {
      id: `user-${Date.now()}`,
      name: dto.name,
      email: dto.email.toLowerCase(),
      role: dto.role ?? 'Membre',
      points: 0,
      status: 'Invite',
    }
    users.push(user)
    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.requireUser(id)
    Object.assign(user, dto)
    return user
  }

  async resetPassword(id: string, _dto: ResetPasswordDto) {
    const user = await this.requireUser(id)
    return { userId: user.id, passwordUpdated: true }
  }

  async remove(id: string) {
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) throw new NotFoundException('User not found')
    users.splice(index, 1)
    return { deleted: true }
  }

  private async requireUser(id: string) {
    const user = users.find((item) => item.id === id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }
}
