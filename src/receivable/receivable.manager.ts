import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile";
import { Receivable} from "./entity/Receivable";

const profileRepository = AppDataSource.getRepository(Profile)
const receivableRepository = AppDataSource.getRepository(Receivable)

export async function getReceivableById(id: number): Promise<Receivable | null> {
    return await receivableRepository.findOne({
        where: {
            id: id,
        },
        relations: {
            profile: true,
        },
    })
}

export async function createNewReceivable(profile: Profile, data: Receivable): Promise<boolean | Receivable> {
    const receivable = new Receivable();

    try {
        receivable.profile = profile;
        receivable.amount = data.amount;
        receivable.transaction_date = data.transaction_date;
        receivable.description = data.description;
        receivable.category = data.category;
        receivable.expected_repayment_date = data.expected_repayment_date;
        receivable.repayment_date = data.repayment_date;
        receivable.debtor = data.debtor;
        profile.receivable.push(receivable);

        await receivableRepository.save(receivable);
        await profileRepository.save(profile);

    } catch(error) {
        console.log(error);
        return false;
    }
    return receivable;
}

export async function patchExistingReceivable(receivable: Receivable | null, profile: Profile, data: Receivable): Promise<boolean> {
    if (receivable === null) {
        console.log("Receivable does not exist")
        return false;
    }

    if (receivable.profile.id !== profile.id) {
        console.log("You can only patch your own expense")
        return false;
    }

    try {
        receivable.amount = data.amount;
        receivable.transaction_date = data.transaction_date;
        receivable.description = data.description;
        receivable.category = data.category;
        receivable.expected_repayment_date = data.expected_repayment_date;
        receivable.repayment_date = data.repayment_date;
        receivable.debtor = data.debtor;

        await receivableRepository.save(receivable);
    } catch (error) {
        console.log("Error when patching receivable: " + error);
        return false
    }
    return true;
}

export async function deleteExistingReceivable(receivable: Receivable | null, profile: Profile): Promise<boolean> {
    if (receivable === null) {
        console.log("receivable does not exist")
        return false;
    }

    try {
        if (receivable.profile.id !== profile.id) {
            console.log("You can only patch your own receivable");
            return false;
        }
        await receivableRepository.remove(receivable);

    } catch(error) {
        console.log("Error when deleting receivable" + error);
        return false;
    }

    return true;
}
