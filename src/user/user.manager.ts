import { AppDataSource } from "../data-source";
import { User } from "./entity/User"
import { Profile } from "../user_profile/entity/User_profile"
import userLogger from "./user.logger";
const bcrypt = require('bcryptjs');

const userRepository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(Profile);

export async function getUserById(id: number): Promise<null | User> {
    return await userRepository.findOne({
        where: {
            id: id
        },
        relations: {
            profile: true,
        },
    })
}

export async function getUserByEmail(email: string): Promise<null | User> {
    return await userRepository.findOneBy({
        email: email,
    });
}

export async function createUser(data: User): Promise<User> {

    const user = new User()
    await setUserData(user,data);

    const profile = new Profile();
    profile.user = user

    try {
        await profileRepository.save(profile)
    } catch(error) {
        userLogger.log("error",`${error}`);
        throw new Error(error);
    }

    user.profile = profile;

    try {
        await userRepository.save(user)
    } catch(error) {
        userLogger.log("error",`${error}`);
        throw new Error(error);
    }

    return user;
}

export async function updateUser(user: User | null, data: User): Promise<boolean> {
    if (user === null) {
        return false;
    }

    return setUserData(user, data);
}

export async function removeUser(user: User | null): Promise<boolean> {
    try {
        if (user === null) {
            return false;
        }

        // @ts-ignore
        // TODO Resolve this
        await userRepository.remove(user);
        return true

    } catch(error) {
        console.log(error)
        return false;
    }
}

async function setUserData(user: User, data: User): Promise<boolean> {
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email
    user.password = encryptPassword(data.password)

    try {
        await userRepository.save(user);

    } catch (error) {
        userLogger.log("error",`${error}`);
        return false;

    }
    return true;
}

function encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    return bcrypt.hashSync(password,  salt);
}