import { Request, Response } from "express";
import { completeKeys } from "../utils/utils"
import { getUserById } from "../user/user.manager";
import { getProfileById } from "../user_profile/user_profile.manager";
import { createNewPayable, getPayableById, patchExistingPayable, deleteExistingPayable } from "../payable/payable.manager";

export async function getPayable(req: Request, res: Response) {
    const payableId = Number(req.params.id);
    const payable = await getPayableById(payableId);

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

    const payable = createNewPayable(profile,data);

    if (!payable) {
        return res.send("Error adding expense")
    }

    return res.send("Payable added");
}

export async function deletePayable(req: Request, res: Response) {
    if (!res.locals.currentProfile) {
        return res.send("You need to be authenticated")
    }
    const profile = res.locals.currentProfile;

    const payableId = Number(req.params.id);
    const payable = await getPayableById(payableId);

    const isPayableDeleted = await deleteExistingPayable(payable, profile);

    if (!isPayableDeleted) {
        return res.send("Error when deleting expense")
    }

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

    return res.send("Patched payable");
}