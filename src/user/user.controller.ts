import {Request, Response} from "express";

import { AppDataSource } from "../data-source";
import { User } from "./entity/User"
import { Profile } from "../user_profile/entity/User_profile"
import { completeKeys } from "../utils/utils"
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const userRepository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(Profile);

const salt = bcrypt.genSaltSync(Number(process.env.SALT));

async function getUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const user = await userRepository.findOneBy({
        id: userId,
    })

    return res.json(user);
}

async function registerUser(req: Request, res: Response) {
    const user = new User()
    const data = req.body;

    if (Object.keys(data).length === 0) {
        return res.send("Empty body")
    }

    const keyFields = ["firstName", "lastName","email","password"];
    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const encryptedPassword = bcrypt.hashSync(data.password,  salt);


    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email
    user.password = encryptedPassword

    try {
        await userRepository.save(user)
    } catch(error) {
        console.log(error)
        return res.send("Error when saving user")
    }

    const profile = new Profile();
    profile.user = user

    try {
        await profileRepository.save(profile)
    } catch(error) {
        return res.send("Error when saving profile")
    }

    user.profile = profile;

    try {
        await userRepository.save(user)
    } catch(error) {
        console.log(error)
        return res.send("Error when saving user")
    }

    return res.send("Success");
}

async function deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const user = await userRepository.findOneBy({
        id: userId,
    })

    try {
        if (user === null) {
            return res.send("User does not exist")
        }
        await userRepository.remove(user);
    } catch(error) {
        return res.send("Error when deleting user")
    }

    return res.send("Deleted User");
}

async function patchUser(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["id", "firstName", "lastName","email","password"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const userId = Number(data.id);

    const user = await userRepository.findOneBy({
        id: userId,
    })

    try {
        if (user === null) {
            return res.send("User does not exist")
        }

        const encryptedPassword = bcrypt.hashSync(data.password,  salt);

        user.firstName = data.firstName
        user.lastName = data.lastName
        user.email = data.email
        user.password = encryptedPassword

        await userRepository.save(user);
    } catch(error) {
        return res.send("Error when patching user")
    }

    return res.json("Patched successfully");
}

async function login(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["email","password"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const user = await userRepository.findOneBy({
        email: data.email,
    })

    if (user === null) {
        return res.send("User does not exist")
    }

    if (await bcrypt.compare(data.password, user.password)) {
        const token = jwt.sign(
            { user_id: user.id },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        const output = {
            "access_token": token,
        }

        return res.status(200).json(output);
    }

    return res.send("Wrong email or password");

}

export {getUser, registerUser, deleteUser, patchUser, login}