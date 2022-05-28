import Express from "express";
import { verify } from "../authentication/auth.middleware";
import { getTransactionsByMonth } from "./analytics.controller";
import {profile} from "../user_profile/user_profile.middleware";

function transactionsRoutes(app: Express.Application) {
    app.get("/api/v0/transactions", verify, profile, getTransactionsByMonth)
}

export default transactionsRoutes;