import {Request, Response} from "express";
import {getUserById} from "../user/user.manager";
import {completeKeys} from "../utils/utils";

import { getTransactionsByDuration } from "./analytics.manager";

export async function getTransactionsByMonth(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["expense_start_date", "expense_end_date"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    const userId = Number(res.locals.currentUserId);
    const user = await getUserById(userId);

    if (user === null) {
        return res.send("User does not exist")
    }
    const profile = user.profile

    const expenses = await getTransactionsByDuration(profile, data["expense_start_date"], data["expense_end_date"]);

    const output = {
        "data": expenses
    }

    return res.json(output);
}