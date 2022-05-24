import { AppDataSource } from "../data-source";
import { Expense } from "./entity/Expense";
import { Profile } from "../user_profile/entity/User_profile"

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

export async function createNewExpense(profile: Profile, data: Expense): Promise<boolean | Expense> {
    const expense = new Expense()

    try {
        expense.profile = profile;
        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;

        profile.expense = [expense];

        await expenseRepository.save(expense);
        await profileRepository.save(profile);

    } catch(error) {
        console.log(error);
        return false;
    }
    return expense;
}

export async function patchExistingExpense(expense: Expense | null, profile: Profile, data: Expense): Promise<boolean> {
    if (expense === null) {
        console.log("Expense does not exist")
        return false;
    }

    if (expense.profile.id !== profile.id) {
        console.log("You can only patch your own expense")
        return false;
    }

    try {
        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;

        await expenseRepository.save(expense);
    } catch (error) {
        console.log("Error when patching expense: " + error);
        return false
    }
    return true;
}

export async function deleteExistingExpense(expense: Expense | null, profile: Profile): Promise<boolean> {
    if (expense === null) {
        console.log("Expense does not exist")
        return false;
    }

    try {
        if (expense.profile.id !== profile.id) {
            console.log("You can only patch your own expense");
            return false;
        }
        await expenseRepository.remove(expense);

    } catch(error) {
        console.log("Error when deleting expense" + error);
        return false;
    }

    return true;
}