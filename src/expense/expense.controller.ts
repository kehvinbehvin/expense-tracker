import {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Expense } from "./entity/Expense";
import { User } from "../user/entity/User";
import { completeKeys } from "../utils/utils"


const expenseRepository = AppDataSource.getRepository(Expense);
const userRepository = AppDataSource.getRepository(User);


async function getExpense(req: Request, res: Response) {
    const expenseId = Number(req.params.id);
    const expense = await expenseRepository.findOneBy({
        id: expenseId,
    })

    return res.json(expense);
}

async function addExpense(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["amount", "expense_date", "description", "category"];
    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const userId = Number(res.locals.currentUserId);
    const user = await userRepository.findOneBy({
        id: userId,
    })

    try {
        if (user === null) {
            return res.send("User does not exist")
        }
        const expense = new Expense()

        expense.user = user;
        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;

        user.expense = [expense];
        await expenseRepository.save(expense);
        await userRepository.save(user);

    } catch(error) {
        console.log(error);
        return res.send("Error when adding expense")
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
    const user = await userRepository.findOneBy({
        id: userId,
    })

    if (user === null) {
        return res.send("User does not exist")
    }

    const expenseId = data.id;
    const expense = await expenseRepository.findOne({
        where: {
            id: expenseId,
        },
        relations: {
            user: true,
        },
    })

    if (expense === null) {
        return res.send("Expense does not exist")
    }

    try {
        if (expense.user.id !== user.id) {
            return res.send("You can only patch your own expense")
        }

        expense.amount = data.amount;
        expense.expense_date = data.expense_date;
        expense.description = data.description;
        expense.category = data.category;

        await expenseRepository.save(expense);
    } catch (error) {
        console.log(error);
        return res.send("Error when patching expense")
    }

    return res.send("Patch Expense")
}

async function deleteExpense(req: Request, res: Response) {
    const userId = Number(res.locals.currentUserId);

    const user = await userRepository.findOneBy({
        id: userId,
    })

    if (user === null) {
        return res.send("User does not exist")
    }

    const expenseId = Number(req.params.id);
    const expense = await expenseRepository.findOne({
        where: {
            id: expenseId,
        },
        relations: {
            user: true,
        },
    })

    if (expense === null) {
        return res.send("Expense does not exist")
    }

    try {
        if (expense.user.id !== user.id) {
            return res.send("You can only patch your own expense")
        }
        await expenseRepository.remove(expense);

    } catch(error) {
        console.log(error);
        return res.send("Error when deleting expense")
    }

    return res.send("Delete Expense")
}

export {getExpense, addExpense, deleteExpense, patchExpense}