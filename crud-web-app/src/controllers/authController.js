const authService = require("../services/authService");

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            ...result
        });

    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const { name, email, age, password } = req.body;

        const user = await authService.registerUser(
            name,
            email,
            age,
            password
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};