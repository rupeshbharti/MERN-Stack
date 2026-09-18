const { z } = require("zod");

const userSchema = z.object({
    name: z
        .string()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: z
        .string()
        .email("Invalid email address"),

    age: z
        .number()
        .int("Age must be an integer")
        .min(1, "Age must be at least 1")
        .max(120, "Age cannot exceed 120")
});

module.exports = {
    userSchema
};