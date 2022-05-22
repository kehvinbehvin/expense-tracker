import { AppDataSource } from "../data-source";
import { User } from "./entity/User"
import { Profile } from "../user_profile/entity/User_profile"
const bcrypt = require('bcryptjs');

const userRepository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(Profile);

interface UserInterface {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    id: number;
}

export async function getUserById(id: number): Promise<null | UserInterface> {
    return await userRepository.findOneBy({
        id: id,
    })
}

export async function getUserByEmail(email: string): Promise<null | UserInterface> {
    return await userRepository.findOneBy({
        email: email,
    });
}

export async function createUser(data: UserInterface): Promise<number | boolean> {

    const user = new User()
    await setUserData(user,data);

    const profile = new Profile();
    profile.user = user

    try {
        await profileRepository.save(profile)
    } catch(error) {
        console.log(error)
        return false;
    }

    user.profile = profile;

    try {
        await userRepository.save(user)
    } catch(error) {
        console.log(error)
        return false;
    }

    return user.id;
}

export async function updateUser(user: UserInterface | null, data: UserInterface): Promise<boolean> {
    if (user === null) {
        return false;
    }

    return setUserData(user, data);
}

export async function removeUser(user: UserInterface | null): Promise<boolean> {
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

async function setUserData(user: UserInterface, data: UserInterface): Promise<boolean> {
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email
    user.password = encryptPassword(data.password)

    try {
        await userRepository.save(user);

    } catch (error) {
        console.log(error);
        return false;

    }
    return true;
}

function encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    return bcrypt.hashSync(password,  salt);
}