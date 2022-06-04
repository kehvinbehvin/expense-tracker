import {Request, Response, NextFunction} from "express";
import { completeKeys } from "../utils/utils"
import { createNewReceivable, getReceivableById, patchExistingReceivable, deleteExistingReceivable } from "./receivable.manager";
import receivableLogChannel from "./receivable.logger";
import {HTTPBadRequestError} from "../utils/error_handling/src/HTTPBadRequestError";
import {HTTPAccessDeniedError} from "../utils/error_handling/src/HTTPAccessDeniedError";
import {HTTPInternalSeverError} from "../utils/error_handling/src/HTTPInternalSeverError";
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes";

export async function getReceivable(req: Request, res: Response,next: NextFunction) {
    try {
        const receivableId = Number(req.params.id);
        const receivable = await getReceivableById(receivableId);
        receivableLogChannel.log("info",`Retrieved receivable id: ${receivableId}`)
        return res.json(receivable);

    } catch (error: any) {
        receivableLogChannel.log("error", error);
        return next(error);
    }
}

export async function addReceivable(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","debtor"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }
        const profile = res.locals.currentProfile;

        const receivable = await createNewReceivable(profile,data);

        if (!receivable) {
            return next(new HTTPInternalSeverError("Error adding receivable"));
        }

        receivableLogChannel.log("info",`Added receivable id: ${receivable.id}`)

        const response = {
            "Message": "Receivable added",
            "Receivable id": `${receivable.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        receivableLogChannel.log("error", error);
        return next(error);
    }

}

export async function updateReceivable(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["id", "amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","debtor"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }

        const profile = res.locals.currentProfile;

        const receivableId = data.id;
        const receivable = await getReceivableById(receivableId);
        const updatedReceivable = await patchExistingReceivable(receivable, profile, data);

        if (!updatedReceivable) {
            return next(new HTTPInternalSeverError("Error patching receivable"));
        }

        receivableLogChannel.log("info",`Updated receivable id: ${updatedReceivable.id}`)

        const response = {
            "Message": "Patched receivable",
            "Receivable id": `${updatedReceivable.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        receivableLogChannel.log("error", error);
        return next(error);
    }

}

export async function deleteReceivable(req: Request, res: Response, next: NextFunction) {
    try {
        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }
        const profile = res.locals.currentProfile;

        const receivableId = Number(req.params.id);
        const receivable = await getReceivableById(receivableId);

        const isReceivableDeleted = await deleteExistingReceivable(receivable, profile);

        if (!isReceivableDeleted) {
            return next(new HTTPInternalSeverError("Error deleting receivable"));
        }

        receivableLogChannel.log("info",`Deleted receivable id: ${isReceivableDeleted.id}`)

        const response = {
            "Message": "Deleted Receivable",
            "Receivable id": `${isReceivableDeleted.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        receivableLogChannel.log("error", error);
        return next(error);
    }

}

