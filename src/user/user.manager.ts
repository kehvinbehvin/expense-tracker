import { AppDataSource } from "../data-source";
import { User } from "./entity/User"
import { Profile } from "../profile/entity/Profile"
import userLogger from "./user.logger";
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError";
import { HTTPInternalSeverError } from "../utils/error_handling/src/HTTPInternalSeverError";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const userRepository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(Profile);

export async function getUserById(id: number): Promise<User> {
    const user = await userRepository.findOne({
        where: {
            id: id
        },
        relations: {
            profile: true,
        },
    })

    if (!user) {
        throw new HTTPNotFoundError(`User id ${id} does not exist`);
    }

    return user
}

export async function getUserByEmail(email: string): Promise<User> {
    const user = await userRepository.findOneBy({
        email: email,
    });

    if (!user) {
        throw new HTTPNotFoundError(`User ${email} does not exist`);
    }

    return user
}

export async function createUser(data: User): Promise<User> {
    try {
        const user = new User()

        await setUserData(user,data);

        const profile = new Profile();
        profile.user = user

        await profileRepository.save(profile)

        user.profile = profile;

        await userRepository.save(user)

        return user;

    } catch(error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating new user");
    }
}

export async function updateUser(user: User, data: User): Promise<User> {
    return setUserData(user, data);
}

export async function removeUser(userId: number): Promise<User> {
    try {
        const user = await getUserById(userId);
        // @ts-ignore
        // TODO Resolve this
        const deletedUser = await userRepository.remove(user);
        return deletedUser;

    } catch(error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting User");
    }
}

async function setUserData(user: User, data: User): Promise<User> {
    try {
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.email = data.email
        user.password = encryptPassword(data.password)
        const updatedUser = await userRepository.save(user);

        return updatedUser;

    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting User");

    }
}

export async function login(user: User, password: string): Promise<string | null> {
    try {
        const successfulLogin = await bcrypt.compare(password, user.password);
        if (!successfulLogin) {
            return null
        } 

        const token = jwt.sign(
            { user_id: user.id },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );

        return token

    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error during login");
    }
    
}

function encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    return bcrypt.hashSync(password,  salt);
}