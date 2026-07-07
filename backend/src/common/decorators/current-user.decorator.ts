import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthUser } from '../../modules/auth/types/auth-user.type'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | null => {
    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>()
    return request.user ?? null
  },
)
