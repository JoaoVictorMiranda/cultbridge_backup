import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
import fs from "fs";


dotenv.config()
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT,
    ssl: {
        ca: fs.readFileSync("src/certs/ca.pem")
    }

})


export { connection };
