import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MemberStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../database/prisma.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { LoginDto } from './dto/login.dto'
import { AuthenticatedUser, AuthResponse, JwtPayload } from './types/auth-response.type'

const PASSWORD_HASH_ROUNDS = 10

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Checks credentials without revealing whether the email exists. Returning a
   * generic 401 prevents account enumeration through the login endpoint.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const email = dto.email.toLowerCase()
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        mustChangePassword: true,
      },
    })
    const isPasswordValid = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : false

    if (!user || !isPasswordValid) {
      this.logger.warn(`Failed login attempt for email=${email}`)
      throw new UnauthorizedException('Invalid credentials')
    }

    return {
      accessToken: await this.signAccessToken(user),
      user: this.toAuthenticatedUser(user),
    }
  }

  /**
   * Lets an authenticated user replace a temporary or current password. The
   * first successful change clears mustChangePassword so the frontend can stop
   * forcing the password update flow.
   */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        mustChangePassword: true,
      },
    })

    if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, PASSWORD_HASH_ROUNDS)
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        mustChangePassword: false,
        status: MemberStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mustChangePassword: true,
      },
    })

    return updatedUser
  }

  async getMe(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mustChangePassword: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }

    return user
  }

  private async signAccessToken(user: AuthenticatedUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }
    return this.jwtService.signAsync(payload)
  }

  private toAuthenticatedUser(
    user: AuthenticatedUser & { passwordHash: string },
  ): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    }
  }
}
