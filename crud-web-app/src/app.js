const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Express + PostgreSQL API is running"
    });
});

module.exports = app;