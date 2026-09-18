const userService = require("../services/userService");


// GET all users
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
};


// GET one user
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
};


// CREATE user
const createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;

        const user = await userService.createUser(
            name,
            email,
            age
        );

        res.status(201).json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
};


// UPDATE user
const updateUser = async (req, res) => {
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
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
};


// DELETE user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userService.deleteUser(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};