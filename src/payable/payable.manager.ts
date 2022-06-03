import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile";
import { Payable } from "./entity/Payable";
import payableLogChannel from "./payable.logger";

const profileRepository = AppDataSource.getRepository(Profile);
const payableRepository = AppDataSource.getRepository(Payable);

export async function getPayableById(id: number): Promise<null | Payable> {
    return await payableRepository.findOne({
        where: {
            id: id,
        },
        relations: {
            profile: true,
        },
    })
}

export async function createNewPayable(profile: Profile, data: Payable): Promise<null | Payable> {
    const payable = new Payable();

    try {
        payable.profile = profile;
        payable.amount = data.amount;
        payable.transaction_date = data.transaction_date;
        payable.description = data.description;
        payable.category = data.category;
        payable.expected_repayment_date = data.expected_repayment_date;
        payable.repayment_date = data.repayment_date;
        payable.creditor = data.creditor;
        profile.payable.push(payable);

        await payableRepository.save(payable);
        await profileRepository.save(profile);

    } catch(error) {
        payableLogChannel.log("error",`${error}`);
        return null;
    }
    return payable;
}

export async function patchExistingPayable(payable: Payable | null, profile: Profile, data: Payable): Promise<null | Payable> {
    if (payable === null) {
        payableLogChannel.log("info",`Expense does not exist`);
        return null;
    }

    if (payable.profile.id !== profile.id) {
        payableLogChannel.log("info",`You can only patch your own expense`);
        return null;
    }

    try {
        payable.amount = data.amount;
        payable.transaction_date = data.transaction_date;
        payable.description = data.description;
        payable.category = data.category;
        payable.expected_repayment_date = data.expected_repayment_date;
        payable.repayment_date = data.repayment_date;
        payable.creditor = data.creditor;

        await payableRepository.save(payable);
    } catch (error) {
        payableLogChannel.log("error",`${error}`);
        return null
    }
    return payable;
}

export async function deleteExistingPayable(payable: Payable | null, profile: Profile): Promise<null | Payable> {
    if (payable === null) {
        payableLogChannel.log("info",`payable does not exist`);
        return null;
    }

    try {
        if (payable.profile.id !== profile.id) {
            payableLogChannel.log("info",`You can only patch your own payable`);
            return null;
        }
        await payableRepository.remove(payable);

    } catch(error) {
        payableLogChannel.log("error",`${error}`);
        return null;
    }

    return payable;
}