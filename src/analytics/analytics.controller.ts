import {NextFunction, Request, Response} from "express";
import {completeKeys, isWhiteListed} from "../utils/utils";
import {HTTPBadRequestError} from "../utils/error_handling/src/HTTPBadRequestError";
import {HTTPAccessDeniedError} from "../utils/error_handling/src/HTTPAccessDeniedError";
import analyticsLogChannel from "./analytics.logger";
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes";
import transactionType from "../configs";
import { getTractionByDuration } from "./analytics.manager";

/**
 * TODOS:
 * - Pagination
 * - Receivables listing
 * - Payables listing
 * - filter by category
 */
export async function getTransactionsByMonth(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        const keyFields = ["transaction_type","start_date", "end_date"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }

        const profile = res.locals.currentProfile;

        const whitelist = [transactionType.EXPENSE, transactionType.RECEIVABLE];
        const transaction_type = data["transaction_type"];
        const start_date = data["start_date"];
        const end_date = data["end_date"];

        if (!isWhiteListed(whitelist, [transaction_type])) {
            return next(new HTTPBadRequestError(`Field ${transaction_type} is invalid`));
        }

        const output = await getTractionByDuration(transaction_type, profile, start_date, end_date)
        
        analyticsLogChannel.log("info",`Retrieve ${transaction_type} between ${start_date} and ${end_date} `)

        const response = {
            "data": output
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        analyticsLogChannel.log("error", error);
        return next(error);
    }
}
