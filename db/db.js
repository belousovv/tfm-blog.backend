import Pool from 'pg-pool'
import 'dotenv/config'

const devConfig = {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
}

const productionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
}

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? productionConfig : devConfig
)

export default pool
