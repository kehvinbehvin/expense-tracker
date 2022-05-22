import {Request, Response} from "express";
import { completeKeys } from "../utils/utils"
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

import { getUserById, createUser, updateUser, removeUser, getUserByEmail } from "./user.manager"

export async function getUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const user = await getUserById(userId);

    if (!user) {
        return res.json("User does not exist")
    }

    return res.json(user);
}

export async function registerUser(req: Request, res: Response) {
    const data = req.body;

    if (Object.keys(data).length === 0) {
        return res.send("Empty body")
    }

    const keyFields = ["firstName", "lastName","email","password"];
    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    // TODO Add check for existing users with same email

    const userId = await createUser(data);

    if (!userId) {
        return res.send("Error when creating user")
    }

    return res.send("userId: " + userId);
}

export async function deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const user = await getUserById(userId);
    const isRemoved = await removeUser(user);

    if (!isRemoved) {
        return res.send("Could not delete user")
    }

    return res.send("Deleted User");
}

export async function patchUser(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["id", "firstName", "lastName","email","password"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const userId = Number(data.id);
    const user = await getUserById(userId);
    const isUpdated = await updateUser(user, data);

    if (!isUpdated) {
        return res.json("Patch unsuccessful")
    }

    return res.json("Patched successfully");
}

export async function login(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["email","password"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const user = await getUserByEmail(data.email);

    if (user === null) {
        return res.send("User does not exist")
    }

    if (await bcrypt.compare(data.password, user.password)) {
        const token = jwt.sign(
            { user_id: user.id },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );

        const output = {
            "access_token": token,
        }

        return res.status(200).json(output);
    }

    return res.send("Wrong email or password");

}

