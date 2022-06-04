import { AppDataSource } from "../data-source";
import { Expense } from "./entity/Expense";
import { Profile } from "../user_profile/entity/User_profile"
import { HTTPInternalSeverError } from "../utils/error_handling/src/HTTPInternalSeverError";
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError";
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError";
import expenseLogChannel from "./expense.logger";

const expenseRepository = AppDataSource.getRepository(Expense);
const profileRepository = AppDataSource.getRepository(Profile);


export async function getExpenseById(id: number): Promise<Expense> {
    const expense = await expenseRepository.findOne({
        where: {
            id: id
        },
        relations: {
            profile: true,
        },
    })

    if (!expense) {
        throw new HTTPNotFoundError(`Expense id ${id} does not exist`);
    }

    return expense;
}

export async function createNewExpense(profile: Profile, data: Expense): Promise<Expense> {
    try {
        const expense = new Expense()

        expense.profile = profile;
        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;
        profile.expense.push(expense);

        await expenseRepository.save(expense);
        await profileRepository.save(profile);

        return expense;

    } catch (error: any) {
        expenseLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating new expense");
    }

}

export async function patchExistingExpense(expense: Expense | null, profile: Profile, data: Expense): Promise<Expense> {
    if (expense === null) {
        throw new HTTPNotFoundError(`Expense does not exist`);
    }

    if (expense.profile.id !== profile.id) {
        throw new HTTPBadRequestError(`You can only patch your own expense`);
    }

    try {
        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;

        await expenseRepository.save(expense);

        return expense;

    } catch (error) {
        expenseLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when patching expense");
    }
}

export async function deleteExistingExpense(expense: Expense | null, profile: Profile): Promise<Expense> {
    if (expense === null) {
        throw new HTTPNotFoundError(`Expense does not exist`);
    }

    if (expense.profile.id !== profile.id) {
        throw new HTTPBadRequestError(`You can only delete your own expense`);
    }

    try {
        await expenseRepository.remove(expense);

        return expense;

    } catch(error) {
        expenseLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting expense");

    }
}