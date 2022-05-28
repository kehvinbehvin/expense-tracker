import {Request, Response} from "express";
import {completeKeys} from "../utils/utils";

import { getTransactionsByDuration } from "./analytics.manager";

export async function getTransactionsByMonth(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["expense_start_date", "expense_end_date"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const expenses = await getTransactionsByDuration(profile, data["expense_start_date"], data["expense_end_date"]);

    const output = {
        "data": expenses
    }

    return res.json(output);
}