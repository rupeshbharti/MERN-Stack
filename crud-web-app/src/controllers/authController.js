const authService = require("../services/authService");

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
    register
};