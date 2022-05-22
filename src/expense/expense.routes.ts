import Express from "express";
import { getExpense, addExpense, deleteExpense, patchExpense } from "./expense.controller"
import { verify } from "../authentication/auth.middleware"

function expenseRoutes(app: Express.Application) {
    app.get("/api/v0/expense/:id", verify, getExpense)
    app.post("/api/v0/expense", verify, addExpense)
    app.delete("/api/v0/expense/:id", verify, deleteExpense)
    app.patch("/api/v0/expense", verify, patchExpense)
}

export default expenseRoutes;