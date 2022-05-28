import {Request, Response} from "express";
import { completeKeys } from "../utils/utils"

import { createNewExpense, deleteExistingExpense, getExpenseById, patchExistingExpense } from "./expense.manager"

export async function getExpense(req: Request, res: Response) {
    const expenseId = Number(req.params.id);
    const expense = await getExpenseById(expenseId);

    return res.json(expense);
}

export async function addExpense(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["amount", "expense_date", "description", "category"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const expense = createNewExpense(profile,data);

    if (!expense) {
        return res.send("Error adding expense")
    }

    return res.send("Expense added")
}

export async function patchExpense(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["amount", "expense_date", "description", "category", "id"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const expenseId = data.id;
    const expense = await getExpenseById(expenseId);
    const updatedExpense = await patchExistingExpense(expense, profile, data);

    if (updatedExpense) {
        return res.send("Failed to patch expense")
    }
    return res.send("Patched Expense")
}

export async function deleteExpense(req: Request, res: Response) {
    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const expenseId = Number(req.params.id);
    const expense = await getExpenseById(expenseId);

    const isExpenseDeleted = await deleteExistingExpense(expense, profile);

    if (!isExpenseDeleted) {
        return res.send("Error when deleting expense")
    }

    return res.send("Delete Expense")
}
