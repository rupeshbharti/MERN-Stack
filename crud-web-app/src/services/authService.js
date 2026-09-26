const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const loginUser = async (email, password) => {

    // Find user
    const result = await pool.query(
        `SELECT id, name, email, age, password
         FROM users
         WHERE email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Generate JWT
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age
        }
    };
};

const registerUser = async (name, email, age, password) => {

    // Check whether email already exists
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
        `INSERT INTO users (name, email, age, password)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, age, created_at`,
        [name, email, age, hashedPassword]
    );

    return result.rows[0];
};

module.exports = {
    registerUser,
    loginUser
};