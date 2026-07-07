import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { MemberStatus, User, UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'

type UiUserRole = 'Admin' | 'Membre'
type UiMemberStatus = 'Actif' | 'Invite'

export type UserResponse = {
  id: string
  name: string
  email: string
  role: UiUserRole
  points: number
  status: UiMemberStatus
  mustChangePassword: boolean
}

const PASSWORD_HASH_ROUNDS = 10
const DEFAULT_TEMPORARY_PASSWORD = 'EgcTemp12345'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
    })

    return users.map((user) => this.toUserResponse(user))
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    return user ? this.toUserResponse(user) : null
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const email = dto.email.toLowerCase()
    const existingUser = await this.prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new ConflictException('Un membre existe deja avec cette adresse e-mail.')
    }

    const passwordHash = await bcrypt.hash(dto.password ?? DEFAULT_TEMPORARY_PASSWORD, PASSWORD_HASH_ROUNDS)
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        passwordHash,
        role: this.toDbRole(dto.role ?? 'Membre'),
        status: MemberStatus.INVITED,
        mustChangePassword: true,
      },
    })

    return this.toUserResponse(user)
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    await this.requireUser(id)

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          email: dto.email?.toLowerCase(),
          role: dto.role ? this.toDbRole(dto.role) : undefined,
          points: dto.points,
          status: dto.status ? this.toDbStatus(dto.status) : undefined,
        },
      })

      return this.toUserResponse(user)
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Un membre existe deja avec cette adresse e-mail.')
      }
      throw error
    }
  }

  async resetPassword(id: string, dto: ResetPasswordDto): Promise<{ user: UserResponse; passwordUpdated: true }> {
    await this.requireUser(id)
    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_HASH_ROUNDS)
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword: true,
      },
    })

    return { user: this.toUserResponse(user), passwordUpdated: true }
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.requireUser(id)
    await this.prisma.user.delete({ where: { id } })
    return { deleted: true }
  }

  private async requireUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === UserRole.ADMIN ? 'Admin' : 'Membre',
      points: user.points,
      status: user.status === MemberStatus.ACTIVE ? 'Actif' : 'Invite',
      mustChangePassword: user.mustChangePassword,
    }
  }

  private toDbRole(role: UiUserRole): UserRole {
    return role === 'Admin' ? UserRole.ADMIN : UserRole.MEMBER
  }

  private toDbStatus(status: UiMemberStatus): MemberStatus {
    return status === 'Actif' ? MemberStatus.ACTIVE : MemberStatus.INVITED
  }

  private isUniqueConstraintError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('code' in error)) return false
    const candidate = error as { code?: unknown }
    return candidate.code === 'P2002'
  }
}
