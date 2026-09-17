const express = require('express');
const { pool } = require('pg');

require("dotenv").config();

const app = express();

//Middleware
app.use(express.json());

//Postgres Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});