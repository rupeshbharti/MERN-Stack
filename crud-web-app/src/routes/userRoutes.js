const express = require("express");

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const validate = require("../middleware/validate");
const { userSchema } = require("../validators/userValidator");

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post("/", validate(userSchema), createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;