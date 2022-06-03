import { Request, Response } from "express";
import { completeKeys } from "../utils/utils"
import { createNewPayable, getPayableById, patchExistingPayable, deleteExistingPayable } from "../payable/payable.manager";
import payableLogChannel from "./payable.logger";

export async function getPayable(req: Request, res: Response) {
    const payableId = Number(req.params.id);
    const payable = await getPayableById(payableId);
    payableLogChannel.log("info",`Retrieved payable id: ${payableId}`);
    return res.json(payable);
}

export async function addPayable(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","creditor"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const payable = await createNewPayable(profile,data);

    if (!payable) {
        return res.send("Error adding expense")
    }

    payableLogChannel.log("info",`Added payable id: ${payable.id}`);

    return res.send("Payable added");
}

export async function deletePayable(req: Request, res: Response) {
    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const payableId = Number(req.params.id);
    const payable = await getPayableById(payableId);

    const PayableDeleted = await deleteExistingPayable(payable, profile);

    if (!PayableDeleted) {
        return res.send("Error when deleting expense")
    }

    payableLogChannel.log("info",`Deleted payable id: ${PayableDeleted.id}`);

    return res.send("deletePayable");
}

export async function updatePayable(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["id", "amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","creditor"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const payableId = data.id;
    const payable = await getPayableById(payableId);
    const updatedPayable = await patchExistingPayable(payable, profile, data);

    if (!updatedPayable) {
        return res.send("Failed to patch payable")
    }

    payableLogChannel.log("info",`Deleted payable id: ${updatedPayable.id}`);

    return res.send("Patched payable");
}