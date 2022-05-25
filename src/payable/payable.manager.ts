import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile";
import { Payable } from "../payable/entity/Payable";

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

export async function createNewPayable(profile: Profile, data: Payable): Promise<boolean | Payable> {
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
        console.log(error);
        return false;
    }
    return payable;
}

export async function patchExistingEPayable(payable: Payable | null, profile: Profile, data: Payable): Promise<boolean> {
    if (payable === null) {
        console.log("Expense does not exist")
        return false;
    }

    if (payable.profile.id !== profile.id) {
        console.log("You can only patch your own expense")
        return false;
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
        console.log("Error when patching payable: " + error);
        return false
    }
    return true;
}

export async function deleteExistingPayable(payable: Payable | null, profile: Profile): Promise<boolean> {
    if (payable === null) {
        console.log("payable does not exist")
        return false;
    }

    try {
        if (payable.profile.id !== profile.id) {
            console.log("You can only patch your own payable");
            return false;
        }
        await payableRepository.remove(payable);

    } catch(error) {
        console.log("Error when deleting payable" + error);
        return false;
    }

    return true;
}