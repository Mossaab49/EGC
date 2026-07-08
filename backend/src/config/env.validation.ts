type Environment = 'development' | 'test' | 'production'

export type AppEnvironment = {
  NODE_ENV: Environment
  PORT: number
  API_PREFIX: string
  DATABASE_URL: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  FRONTEND_URL: string
}

export function validateConfig(config: Record<string, unknown>): AppEnvironment {
  const nodeEnv = parseEnvironment(config.NODE_ENV)
  const jwtSecret = requiredString(config.JWT_SECRET, 'JWT_SECRET')
  validateProductionSecret(jwtSecret, nodeEnv)

  return {
    NODE_ENV: nodeEnv,
    PORT: parsePort(config.PORT),
    API_PREFIX: optionalString(config.API_PREFIX, 'api/v1'),
    DATABASE_URL: requiredString(config.DATABASE_URL, 'DATABASE_URL'),
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: optionalString(config.JWT_EXPIRES_IN, '7d'),
    FRONTEND_URL: resolveFrontendUrl(config.FRONTEND_URL, nodeEnv),
  }
}

function parseEnvironment(value: unknown): Environment {
  if (value === 'test' || value === 'production') return value
  return 'development'
}

function requiredString(value: unknown, key: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${key} is required`)
  }
  return value
}

function optionalString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

function parsePort(value: unknown): number {
  const port = Number(value ?? 4000)
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port')
  }
  return port
}

function resolveFrontendUrl(value: unknown, nodeEnv: Environment): string {
  const fallback = nodeEnv === 'production' ? undefined : 'http://localhost:5173'
  const frontendUrl = typeof value === 'string' && value.length > 0 ? value : fallback

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL is required in production')
  }

  try {
    return new URL(frontendUrl).origin
  } catch {
    throw new Error('FRONTEND_URL must be a valid URL')
  }
}

function validateProductionSecret(secret: string, nodeEnv: Environment): void {
  if (nodeEnv !== 'production') return
  if (secret.includes('change-me') || secret.length < 32) {
    throw new Error('JWT_SECRET must be a strong production secret of at least 32 characters')
  }
}
