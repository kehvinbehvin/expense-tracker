import { AppDataSource } from "../data-source";
import { Expense } from "./entity/Expense";
import { Profile } from "../user_profile/entity/User_profile"
import expenseLogChannel from "./expense.logger";

const expenseRepository = AppDataSource.getRepository(Expense);
const profileRepository = AppDataSource.getRepository(Profile);


export async function getExpenseById(id: number): Promise<null | Expense> {
    return await expenseRepository.findOne({
        where: {
            id: id
        },
        relations: {
            profile: true,
        },
    })
}

export async function createNewExpense(profile: Profile, data: Expense): Promise<null | Expense> {
    const expense = new Expense()

    try {
        expense.profile = profile;
        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;
        profile.expense.push(expense);

        await expenseRepository.save(expense);
        await profileRepository.save(profile);

    } catch(error) {
        expenseLogChannel.log("error",`${error}`);
        return null;
    }
    return expense;
}

export async function patchExistingExpense(expense: Expense | null, profile: Profile, data: Expense): Promise<null | Expense> {
    if (expense === null) {
        expenseLogChannel.log("info",`Expense does not exist`);
        return null;
    }

    if (expense.profile.id !== profile.id) {
        expenseLogChannel.log("info",`You can only patch your own expense`);
        return null;
    }

    try {
        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;

        await expenseRepository.save(expense);
    } catch (error) {
        expenseLogChannel.log("error",`${error}`);
        return null
    }
    return expense;
}

export async function deleteExistingExpense(expense: Expense | null, profile: Profile): Promise<null | Expense> {
    if (expense === null) {
        expenseLogChannel.log("info",`Expense does not exist`);
        return null;
    }

    try {
        if (expense.profile.id !== profile.id) {
            expenseLogChannel.log("info",`You can only patch your own expense`);
            return null;
        }
        await expenseRepository.remove(expense);

    } catch(error) {
        expenseLogChannel.log("error",`${error}`);
        return null;
    }

    return expense;
}