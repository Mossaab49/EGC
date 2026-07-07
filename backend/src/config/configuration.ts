export type AppConfiguration = {
  jwt: {
    secret: string
    expiresIn: string
  }
  database: {
    url: string
  }
}

export default (): AppConfiguration => ({
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
})
