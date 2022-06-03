import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile";
import { Receivable} from "./entity/Receivable";
import receivableLogChannel from "./receivable.logger";

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

export async function createNewReceivable(profile: Profile, data: Receivable): Promise<null | Receivable> {
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
        receivableLogChannel.log("error",`${error}`);
        return null;
    }
    return receivable;
}

export async function patchExistingReceivable(receivable: Receivable | null, profile: Profile, data: Receivable): Promise<null | Receivable> {
    if (receivable === null) {
        receivableLogChannel.log("info","Receivable does not exist");
        return null;

    }

    if (receivable.profile.id !== profile.id) {
        receivableLogChannel.log("info","You can only patch your own expense");
        return null;
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
        receivableLogChannel.log("error",`${error}`);
        return null
    }
    return receivable;
}

export async function deleteExistingReceivable(receivable: Receivable | null, profile: Profile): Promise<null | Receivable> {
    if (receivable === null) {
        receivableLogChannel.log("infor",`receivable does not exist`);
        return null;
    }

    try {
        if (receivable.profile.id !== profile.id) {
            receivableLogChannel.log("infor",`You can only patch your own receivable`);
            return null;
        }
        await receivableRepository.remove(receivable);

    } catch(error) {
        receivableLogChannel.log("error",`${error}`);
        return null;
    }

    return receivable;
}
