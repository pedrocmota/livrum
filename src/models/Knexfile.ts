import {Knex} from 'knex'
import path from 'path'
import dotenv from 'dotenv'

const knexConfig = () => {
  if (process.env.npm_lifecycle_event === 'migrates') {
    dotenv.config({path: path.resolve(__dirname, '../../.env')})
  }
  const config: Knex.Config = {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_IP,
      port: parseInt(process.env.DATABASE_PORT as any),
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    migrations: {
      directory: `${__dirname}/migrations`
    },
    useNullAsDefault: true
  }
  return config
}

export default knexConfig()