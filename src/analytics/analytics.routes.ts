import Express from "express";
import { verify } from "../authentication/auth.middleware";
import { getTransactionsByMonth } from "./analytics.controller";

function transactionsRoutes(app: Express.Application) {
    app.get("/api/v0/transactions", verify, getTransactionsByMonth)
}

export default transactionsRoutes;