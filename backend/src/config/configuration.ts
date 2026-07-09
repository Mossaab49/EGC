export type AppConfiguration = {
  app: {
    env: string
    port: number
    apiPrefix: string
    frontendUrl: string
  }
  jwt: {
    secret: string
    expiresIn: string
  }
  database: {
    url: string
  }
  minecraft: {
    apiKey: string
  }
}

export default (): AppConfiguration => ({
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 4000),
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  minecraft: {
    apiKey: process.env.MINECRAFT_API_KEY ?? '',
  },
})
