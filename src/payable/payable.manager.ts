import { HTTPBadRequestError } from "src/utils/error_handling/src/HTTPBadRequestError";
import { HTTPInternalSeverError } from "src/utils/error_handling/src/HTTPInternalSeverError";
import { HTTPNotFoundError } from "src/utils/error_handling/src/HTTPNotFoundError";
import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile";
import { Payable } from "./entity/Payable";
import payableLogChannel from "./payable.logger";

const profileRepository = AppDataSource.getRepository(Profile);
const payableRepository = AppDataSource.getRepository(Payable);

export async function getPayableById(id: number): Promise<Payable> {
    const payable = await payableRepository.findOne({
        where: {
            id: id,
        },
        relations: {
            profile: true,
        },
    })

    if (!payable) {
        throw new HTTPNotFoundError(`Payable id ${id} does not exist`);
    }

    return payable
}

export async function createNewPayable(profile: Profile, data: Payable): Promise<Payable> {
    try {
        const payable = new Payable();

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

        return payable;

    } catch(error: any) {
        payableLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating new payable");
    }
}

export async function patchExistingPayable(payable: Payable | null, profile: Profile, data: Payable): Promise<Payable> {
    if (payable === null) {
        throw new HTTPNotFoundError(`Payable does not exist`);

    }

    if (payable.profile.id !== profile.id) {
        throw new HTTPBadRequestError(`You can only patch your own payable`);
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

        return payable;

    } catch (error) {
        payableLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when patching payable");

    }
}

export async function deleteExistingPayable(payable: Payable | null, profile: Profile): Promise<Payable> {
    if (payable === null) {
        throw new HTTPNotFoundError(`Payable does not exist`);
    }

    if (payable.profile.id !== profile.id) {
        throw new HTTPBadRequestError(`You can only delete your own payable`);
    }

    try {
        await payableRepository.remove(payable);

        return payable;

    } catch(error: any) {
        payableLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting Payable");

    }
}