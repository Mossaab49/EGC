type Environment = 'development' | 'test' | 'production'

export type AppEnvironment = {
  NODE_ENV: Environment
  PORT: number
  API_PREFIX: string
  DATABASE_URL: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  CORS_ORIGIN: string
}

export function validateConfig(config: Record<string, unknown>): AppEnvironment {
  return {
    NODE_ENV: parseEnvironment(config.NODE_ENV),
    PORT: Number(config.PORT ?? 4000),
    API_PREFIX: String(config.API_PREFIX ?? 'api/v1'),
    DATABASE_URL: requiredString(config.DATABASE_URL, 'DATABASE_URL'),
    JWT_SECRET: requiredString(config.JWT_SECRET, 'JWT_SECRET'),
    JWT_EXPIRES_IN: String(config.JWT_EXPIRES_IN ?? '7d'),
    CORS_ORIGIN: String(config.CORS_ORIGIN ?? 'http://localhost:5173'),
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
