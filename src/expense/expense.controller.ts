import {Request, Response} from "express";
import { completeKeys } from "../utils/utils"

import {createNewExpense, deleteExistingExpense, getExpenseById, patchExistingExpense} from "./expense.manager"
import { getUserById } from "../user/user.manager";

async function getExpense(req: Request, res: Response) {
    const expenseId = Number(req.params.id);
    const expense = await getExpenseById(expenseId);

    return res.json(expense);
}

async function addExpense(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["amount", "expense_date", "description", "category"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const userId = Number(res.locals.currentUserId);
    const user = await getUserById(userId);

    if (user === null) {
        return res.send("User does not exist")
    }
    const profile = user.profile

    const expense = createNewExpense(profile,data);

    if (!expense) {
        return res.send("Error adding expense")
    }

    return res.send("Expense added")
}

async function patchExpense(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["amount", "expense_date", "description", "category", "id"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const userId = Number(res.locals.currentUserId);
    const user = await getUserById(userId);

    if (user === null) {
        return res.send("User does not exist")
    }

    const profile = user.profile
    const expenseId = data.id;
    const expense = await getExpenseById(expenseId);
    const updatedExpense = await patchExistingExpense(expense, profile, data);

    if (updatedExpense) {
        return res.send("Failed to patch expense")
    }
    return res.send("Patched Expense")
}

async function deleteExpense(req: Request, res: Response) {
    const userId = Number(res.locals.currentUserId);

    const user = await getUserById(userId);

    if (user === null) {
        return res.send("User does not exist")
    }

    const profile = user.profile

    const expenseId = Number(req.params.id);
    const expense = await getExpenseById(expenseId);

    const isExpenseDeleted = await deleteExistingExpense(expense, profile);

    if (!isExpenseDeleted) {
        return res.send("Error when deleting expense")
    }

    return res.send("Delete Expense")
}

export {getExpense, addExpense, deleteExpense, patchExpense}