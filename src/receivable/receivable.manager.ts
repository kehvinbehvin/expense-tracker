import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile";
import { Receivable} from "./entity/Receivable";
import receivableLogChannel from "./receivable.logger";
import {HTTPNotFoundError} from "../utils/error_handling/src/HTTPNotFoundError";
import {HTTPInternalSeverError} from "../utils/error_handling/src/HTTPInternalSeverError";
import {HTTPBadRequestError} from "../utils/error_handling/src/HTTPBadRequestError";

const profileRepository = AppDataSource.getRepository(Profile)
const receivableRepository = AppDataSource.getRepository(Receivable)

export async function getReceivableById(id: number): Promise<Receivable> {
    const receivable = await receivableRepository.findOne({
        where: {
            id: id,
        },
        relations: {
            profile: true,
        },
    })

    if (!receivable) {
        throw new HTTPNotFoundError(`Receivable id ${id} does not exist`);
    }

    return receivable
}

export async function createNewReceivable(profile: Profile, data: Receivable): Promise<Receivable> {
    try {
        const receivable = new Receivable();

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

        return receivable;

    } catch(error: any) {
        receivableLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating new receivable");

    }
}

export async function patchExistingReceivable(receivable: Receivable | null, profile: Profile, data: Receivable): Promise<Receivable> {
    if (receivable === null) {
        throw new HTTPNotFoundError(`Receivable does not exist`);
    }

    if (receivable.profile.id !== profile.id) {
        throw new HTTPBadRequestError(`You can only patch your own receivable`);
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

        return receivable;

    } catch (error: any) {
        receivableLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when patching receivable");

    }
}

export async function deleteExistingReceivable(receivable: Receivable | null, profile: Profile): Promise<Receivable> {
    if (receivable === null) {
        throw new HTTPNotFoundError(`Receivable does not exist`);
    }

    if (receivable.profile.id !== profile.id) {
        throw new HTTPBadRequestError(`You can only delete your own receivable`);
    }

    try {
        await receivableRepository.remove(receivable);

        return receivable;

    } catch(error: any) {
        receivableLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting receivable");

    }
}
