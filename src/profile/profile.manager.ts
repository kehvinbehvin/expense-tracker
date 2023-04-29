import { AppDataSource } from "../data-source";
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError";
import { Profile } from "./entity/Profile"

const profileRepository = AppDataSource.getRepository(Profile);

export async function getProfileById(id: number): Promise<Profile | null> {
    const profile = await profileRepository.findOne({
        where: {
            id: id,
        },
        relations: {
            expense: true,
            payable: true,
            receivable: true,
        }
    })
    if (!profile) {
        throw new HTTPNotFoundError(`Profile id ${id} does not exist`);
    }

    return profile;
}