const userService = require("../services/userService");
const AppError = require("../utils/AppErrors");


// GET all users
const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json(users);

    } catch (error) {
        next(error);
    }
};


// GET one user
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
};


// CREATE user
const createUser = async (req, res, next) => {
    try {
        const { name, email, age } = req.body;

        const user = await userService.createUser(
            name,
            email,
            age
        );

        res.status(201).json(user);

    } catch (error) {
        next(error);
    }
};


// UPDATE user
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        const user = await userService.updateUser(
            id,
            name,
            email,
            age
        );

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
};


// DELETE user
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await userService.deleteUser(id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            message: "User deleted successfully",
            user
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};