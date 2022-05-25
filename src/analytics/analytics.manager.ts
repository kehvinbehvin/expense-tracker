import { AppDataSource } from "../data-source";
import { Expense } from "../expense/entity/Expense";
import { Profile } from "../user_profile/entity/User_profile"

const expenseRepository = AppDataSource.getRepository(Expense);

export async function getTransactionsByDuration(profile: Profile, start_date: string, end_date: string): Promise<Expense[]> {
    // Query database for all expenses of a profile between 2 months

    const profileId = profile.id;

    const expenses = expenseRepository.createQueryBuilder("expense")
        .innerJoin("expense.profile","profile")
        .where("user.profile = :profileId", { profileId })
        .where("expense.expense_date BETWEEN :start_date AND :end_date", {start_date: start_date, end_date: end_date})
        .getMany()

    return expenses;
}
