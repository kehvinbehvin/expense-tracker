import { AppDataSource } from "../data-source";
import { Expense } from "../expense/entity/Expense";
import { Profile } from "../user_profile/entity/User_profile"
import { Receivable } from "../receivable/entity/Receivable";
import {HTTPBadRequestError} from "../utils/error_handling/src/HTTPBadRequestError";
import {HTTPInternalSeverError} from "../utils/error_handling/src/HTTPInternalSeverError";
import analyticsLogChannel from "./analytics.logger";
import transactionType from "../configs";

const expenseRepository = AppDataSource.getRepository(Expense);
const receivableRepository = AppDataSource.getRepository(Receivable);

export async function getTractionByDuration(transaction_type: string, profile: Profile, start_date: string, end_date: string): Promise<Expense[] | Receivable[]> {
    // Query database for all expenses of a profile between 2 dates
    
    if (transaction_type === transactionType.EXPENSE) {
        return await getExpenseByDuration(profile, start_date, end_date);
    } else if (transaction_type === transactionType.RECEIVABLE) {
        return await getReceivablesByDuration(profile,start_date, end_date);
    } else {
        throw new HTTPBadRequestError(`Invalid Transction type`);
    }

}

async function getExpenseByDuration(profile: Profile, start_date: string, end_date: string): Promise<Expense[]> {
    try {
        const profileId = profile.id;

        const expenses = expenseRepository.createQueryBuilder("expense")
            .innerJoin("expense.profile","profile")
            .where("expuser.profile = :profileId", { profileId })
            .where("expense.expense_date BETWEEN :start_date AND :end_date", {start_date: start_date, end_date: end_date})
            .getMany()
    
        return expenses;
    } catch(error: any) {
        analyticsLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when retrieving expenses");
    }
}

async function getReceivablesByDuration(profile: Profile, start_date: string, end_date: string): Promise<Receivable[]> {
    try {
        const profileId = profile.id;

        const receivable = receivableRepository.createQueryBuilder("receivable")
            .innerJoin("receivable.profile","profile")
            .where("expuser.profile = :profileId", { profileId })
            .where("receivable.transaction_date BETWEEN :start_date AND :end_date", {start_date: start_date, end_date: end_date})
            .getMany()
    
        return receivable;
    } catch(error: any) {
        analyticsLogChannel.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when retrieving receivables");
    }
   
}
