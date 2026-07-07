import { UserRole } from '@prisma/client'

export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: UserRole
  mustChangePassword: boolean
}

export type JwtPayload = {
  sub: string
  email: string
  role: UserRole
}

export type AuthResponse = {
  accessToken: string
  user: AuthenticatedUser
}
