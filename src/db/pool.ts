// THIS FILES CONNECTS TO THE DATABASE 
// AND EXPOSES IT VIA A POOL

import config from '../utils/config'
import logger from '../utils/logger'
import { Pool } from 'pg'

const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_NAME,
    password: config.DB_PASS,
    port: config.DB_PORT,
})

pool.on('error', (error) => {
    logger.error('Unexpected PostgreSQL error', error)
})

export default pool