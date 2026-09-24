const express = require("express");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");


const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Express + PostgreSQL API is running"
    });
});

app.use(errorHandler);

module.exports = app;