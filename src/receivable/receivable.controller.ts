import {Request, Response} from "express";
import { completeKeys } from "../utils/utils"
import { createNewReceivable, getReceivableById, patchExistingReceivable, deleteExistingReceivable } from "../receivable/receivable.manager";

export async function getReceivable(req: Request, res: Response) {
    const receivableId = Number(req.params.id);
    const receivable = await getReceivableById(receivableId);

    return res.json(receivable);
}

export async function addReceivable(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","debtor"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const receivable = createNewReceivable(profile,data);

    if (!receivable) {
        return res.send("Error adding expense")
    }

    return res.send("Receivable added");
}

export async function updateReceivable(req: Request, res: Response) {
    const data = req.body;

    const keyFields = ["id", "amount", "transaction_date", "description", "category","repayment_date","expected_repayment_date","debtor"];

    if (!completeKeys(keyFields,data)) {
        return res.send("Incomplete data");
    }

    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const receivableId = data.id;
    const receivable = await getReceivableById(receivableId);
    const updatedReceivable = await patchExistingReceivable(receivable, profile, data);

    if (!updatedReceivable) {
        return res.send("Failed to patch payable")
    }

    return res.send("Patched payable");
}

export async function deleteReceivable(req: Request, res: Response) {
    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const receivableId = Number(req.params.id);
    const receivable = await getReceivableById(receivableId);

    const isReceivableDeleted = await deleteExistingReceivable(receivable, profile);

    if (!isReceivableDeleted) {
        return res.send("Error when deleting receivable")
    }

    return res.send("Deleted receivable");
}

