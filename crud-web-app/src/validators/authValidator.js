const { z } = require("zod");

const registerSchema = z.object({
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
        .max(120, "Age cannot exceed 120"),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
});

const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required")
});

module.exports = {
    registerSchema,
    loginSchema
};