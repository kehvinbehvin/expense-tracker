import { Request, Response, NextFunction } from "express";
import { completeKeys } from "../utils/utils"
import { createNewPayable, getPayableById, patchExistingPayable, deleteExistingPayable } from "../payable/payable.manager";
import payableLogChannel from "./payable.logger";
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError";
import { HTTPAccessDeniedError } from "../utils/error_handling/src/HTTPAccessDeniedError";
import { HTTPInternalSeverError } from "../utils/error_handling/src/HTTPInternalSeverError";
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes";

export async function getPayable(req: Request, res: Response, next: NextFunction) {
    try {
        const payableId = Number(req.params.id);
        const payable = await getPayableById(payableId);
        payableLogChannel.log("info",`Retrieved payable id: ${payableId}`);
        return res.json(payable);

    } catch (error: any) {
        payableLogChannel.log("error", error);
        return next(error);
    }
}

export async function addPayable(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","creditor"];
    
        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }
    
        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }
        const profile = res.locals.currentProfile;
    
        const payable = await createNewPayable(profile,data);
    
        if (!payable) {
            return next(new HTTPInternalSeverError("Error adding payable"));
        }
    
        payableLogChannel.log("info",`Added payable id: ${payable.id}`);
    
        const response = {
            "Message": "Payable added",
            "Payable id": `${payable.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        payableLogChannel.log("error", error);
        return next(error);
    }
    
}

export async function deletePayable(req: Request, res: Response, next: NextFunction) {
    try {
        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }
        const profile = res.locals.currentProfile;
    
        const payableId = Number(req.params.id);
        const payable = await getPayableById(payableId);
    
        const isPayableDeleted = await deleteExistingPayable(payable, profile);
    
        if (!isPayableDeleted) {
            return next(new HTTPInternalSeverError("Error deleting payable"));
        }
    
        payableLogChannel.log("info",`Deleted payable id: ${isPayableDeleted.id}`);
    
        const response = {
            "Message": "Deleted Receivable",
            "Receivable id": `${isPayableDeleted.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);
        
    } catch(error: any) {
        payableLogChannel.log("error", error);
        return next(error);
    }
    
}

export async function updatePayable(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["id", "amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","creditor"];
    
        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }
    
        if (!res.locals.currentProfile) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }

        const profile = res.locals.currentProfile;
    
        const payableId = data.id;
        const payable = await getPayableById(payableId);
        const updatedPayable = await patchExistingPayable(payable, profile, data);
    
        if (!updatedPayable) {
            return next(new HTTPInternalSeverError("Error patching payable"));
        }
    
        payableLogChannel.log("info",`Updated payable id: ${updatedPayable.id}`);
    
        const response = {
            "Message": "Patched payable",
            "Payable id": `${updatedPayable.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        payableLogChannel.log("error", error);
        return next(error);
    }
    
}