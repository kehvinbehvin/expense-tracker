import Express from "express";
import { getExpense, addExpense, deleteExpense, patchExpense } from "./expense.controller"
import { verify } from "../authentication/auth.middleware"
import {profile} from "../user_profile/user_profile.middleware";

function expenseRoutes(app: Express.Application) {
    app.get("/api/v0/expense/:id", verify, profile, getExpense)
    app.post("/api/v0/expense", verify, profile, addExpense)
    app.delete("/api/v0/expense/:id", verify, profile, deleteExpense)
    app.patch("/api/v0/expense", verify, profile, patchExpense)
}

export default expenseRoutes;