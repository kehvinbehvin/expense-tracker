import {Request, Response} from "express";
import { completeKeys } from "../utils/utils"
import expenseLogChannel from "./expense.logger";
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes";

import { createNewExpense, deleteExistingExpense, getExpenseById, patchExistingExpense } from "./expense.manager"


export async function getExpense(req: Request, res: Response) {
    try {
        const expenseId = Number(req.params.id);
        const expense = await getExpenseById(expenseId);
        expenseLogChannel.log("info",`Retrieve expense id: ${expenseId}`);
        return res.json(expense);

    } catch(error) {
        expenseLogChannel.log("error", error);
        const response = {
            "Message": `${error.message}`,
        }
        return res.json(response).status(error.statusCode);

    }
}

export async function addExpense(req: Request, res: Response) {
    try {
        const data = req.body;

        const keyFields = ["amount", "expense_date", "description", "category"];

        if (!completeKeys(keyFields,data)) {
            const response = {
                "Message": "Incomplete data",
            }
            return res.json(response).status(httpStatusCodes.BAD_REQUEST);
        }

        if (!res.locals.currentProfile) {
            const response = {
                "Message": "You need to be authenticated",
            }
            return res.json(response).status(httpStatusCodes.ACCESS_DENIED);
        }
        const profile = res.locals.currentProfile;

        const expense = await createNewExpense(profile,data);

        if (!expense) {
            const response = {
                "Message": "Error adding expense",
            }
            return res.json(response).status(httpStatusCodes.INTERNAL_SERVER_ERROR);
        }

        expenseLogChannel.log("info",`Added expense id: ${expense.id}`);

        const response = {
            "Message": "Expense added",
            "Expense id": `${expense.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch(error) {
        expenseLogChannel.log("error", error);
        const response = {
            "Message": `${error.message}`,
        }
        return res.json(response).status(error.statusCode);

    }

}

export async function patchExpense(req: Request, res: Response) {
    try {
        const data = req.body;

        const keyFields = ["amount", "expense_date", "description", "category", "id"];

        if (!completeKeys(keyFields,data)) {
            const response = {
                "Message": "Incomplete data",
            }
            return res.json(response).status(httpStatusCodes.BAD_REQUEST);
        }

        if (!res.locals.currentProfile) {
            const response = {
                "Message": "You need to be authenticated",
            }
            return res.json(response).status(httpStatusCodes.ACCESS_DENIED);
        }

        const profile = res.locals.currentProfile;

        const expenseId = data.id;
        const expense = await getExpenseById(expenseId);
        const updatedExpense = await patchExistingExpense(expense, profile, data);

        if (!updatedExpense) {
            const response = {
                "Message": "Failed to patch expense",
            }
            return res.json(response).status(httpStatusCodes.INTERNAL_SERVER_ERROR);
        }

        expenseLogChannel.log("info",`Updated expense id: ${updatedExpense.id}`);

        const response = {
            "Message": "Patched Expense",
            "Expense id": `${updatedExpense.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        expenseLogChannel.log("error", error);
        const response = {
            "Message": `${error.message}`,
        }
        return res.json(response).status(error.statusCode);
    }
}

export async function deleteExpense(req: Request, res: Response) {
    try {
        if (!res.locals.currentProfile) {
            const response = {
                "Message": "You need to be authenticated",
            }
            return res.json(response).status(httpStatusCodes.ACCESS_DENIED);
        }

        const profile = res.locals.currentProfile;

        const expenseId = Number(req.params.id);
        const expense = await getExpenseById(expenseId);

        const deletedExpense = await deleteExistingExpense(expense, profile);

        if (!deletedExpense) {
            const response = {
                "Message": "Error when deleting expense",
            }
            return res.json(response).status(httpStatusCodes.INTERNAL_SERVER_ERROR);
        }

        expenseLogChannel.log("info",`Updated expense id: ${deletedExpense.id}`);

        const response = {
            "Message": "Deleted Expense",
            "Expense id": `${deletedExpense.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch(error: any) {
        expenseLogChannel.log("error", error);
        const response = {
            "Message": `${error.message}`,
        }
        return res.json(response).status(error.statusCode);
    }
}
