const express = require('express');
const { Pool } = require('pg');

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

// Test Routes

app.get("/", (req, res) =>{
    res.json({
        message: "Express + Postgres CRUD project API running."
    });
});

// Get all users

app.get("/api/users", async (req, res) =>{
    try{
        const result = await pool.query(
            "SELECT* FROM users ORDER BY id"
        );

        res.json(result.rows);
    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Database error"
        })
    }
});

app.get("/api/users/:id", async (req, res) =>{
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT* FROM users WHERE id = $1",
            [id]
        );

        if(result.rows.length === 0){
                return res.status(404).json({
                    message : "User not found"
                });
        }

        res.json(result.rows[0]);
    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
});

app.post("/api/users", async (req, res) =>{
    try{
        const { name, email, age } = req.body;

        const result = await pool.query(
            `INSERT INTO users (name, email, age)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, email, age]
        );

        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
});

app.put("/api/users/:id", async (req, res) =>{
    try{
        const { id } = req.params
        const { name, email, age } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET name = $1,
                 email = $2,
                 age = $3
             WHERE id = $4
             RETURNING *`,
             [name, email, age, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(result.rows[0]);
    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
});

app.delete("/api/users/:id", async (req, res) =>{
    try{
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM users
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message: "User not found"
            });
        }
    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
})

const  PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});