import dotenv from 'dotenv'
dotenv.config()

const {
    PORT,
    DB_NAME,
    DB_HOST,
    DB_PASS,
    DB_USER,
    JWT_EXPIRES_IN,
    JWT_SECRET,
} = process.env

const DB_PORT = Number(process.env.DB_PORT)

export default {
    PORT,
    DB_NAME,
    DB_HOST,
    DB_PASS,
    DB_PORT,
    DB_USER,
    JWT_EXPIRES_IN,
    JWT_SECRET,
}