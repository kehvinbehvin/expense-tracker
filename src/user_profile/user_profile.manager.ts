import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile"

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

    return profile;
}