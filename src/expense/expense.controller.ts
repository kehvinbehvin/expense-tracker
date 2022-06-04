import {Request, Response, NextFunction} from "express";
import { completeKeys } from "../utils/utils"
import {HTTPInternalSeverError} from "../utils/error_handling/src/HTTPInternalSeverError";
import {HTTPAccessDeniedError} from "../utils/error_handling/src/HTTPAccessDeniedError";
import {HTTPBadRequestError} from "../utils/error_handling/src/HTTPBadRequestError";
import expenseLogChannel from "./expense.logger";
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes";

import { createNewExpense, deleteExistingExpense, getExpenseById, patchExistingExpense } from "./expense.manager"


export async function getExpense(req: Request, res: Response, next: NextFunction) {
    try {
        const expenseId = Number(req.params.id);
        const expense = await getExpenseById(expenseId);
        expenseLogChannel.log("info",`Retrieve expense id: ${expenseId}`);
        return res.json(expense);

    } catch(error) {
        expenseLogChannel.log("error", error);
        return next(error);
    }
}

export async function addExpense(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["amount", "expense_date", "description", "category"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }
        const profile = res.locals.currentProfile;

        const expense = await createNewExpense(profile,data);

        if (!expense) {
            return next(new HTTPInternalSeverError("Error adding expense"));
        }

        expenseLogChannel.log("info",`Added expense id: ${expense.id}`);

        const response = {
            "Message": "Expense added",
            "Expense id": `${expense.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch(error) {
        expenseLogChannel.log("error", error);
        return next(error);
    }

}

export async function patchExpense(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["amount", "expense_date", "description", "category", "id"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }

        const profile = res.locals.currentProfile;

        const expenseId = data.id;
        const expense = await getExpenseById(expenseId);
        const updatedExpense = await patchExistingExpense(expense, profile, data);

        if (!updatedExpense) {
            return next(new HTTPInternalSeverError("Error patching expense"));
        }

        expenseLogChannel.log("info",`Updated expense id: ${updatedExpense.id}`);

        const response = {
            "Message": "Patched Expense",
            "Expense id": `${updatedExpense.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        expenseLogChannel.log("error", error);
        return next(error);
    }
}

export async function deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }

        const profile = res.locals.currentProfile;

        const expenseId = Number(req.params.id);
        const expense = await getExpenseById(expenseId);

        const deletedExpense = await deleteExistingExpense(expense, profile);

        if (!deletedExpense) {
            return next(new HTTPInternalSeverError("Error deleting expense"));
        }

        expenseLogChannel.log("info",`Updated expense id: ${deletedExpense.id}`);

        const response = {
            "Message": "Deleted Expense",
            "Expense id": `${deletedExpense.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch(error: any) {
        expenseLogChannel.log("error", error);
        return next(error);
    }
}
