
module.exports = {
  db: {
    database: process.env.DB_NAME || 'homie',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  },
  key_jwt: process.env.KEY_JWT || '4551a5b972f4',
  environment: process.env.NODE_ENV || 'localhost'
}
