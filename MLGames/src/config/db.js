// config/db.js

import mysql from "mysql2";
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} from "./env.js";

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

console.log("✅ Pool de conexões MySQL criado");

export default db;