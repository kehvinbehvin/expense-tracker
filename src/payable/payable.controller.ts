import {Request, Response} from "express";
import { completeKeys } from "../utils/utils"
import { getUserById } from "../user/user.manager";
import { getProfileById } from "../user_profile/user_profile.manager";
import { createNewPayable, getPayableById, patchExistingEPayable, deleteExistingPayable } from "../payable/payable.manager";

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

    const userId = Number(res.locals.currentUserId);
    const user = await getUserById(userId);

    if (user === null) {
        return res.send("User does not exist")
    }
    const profile = await getProfileById(user.profile.id);

    if (profile === null) {
        return res.send("Profile does not exist")
    }

    const payable = createNewPayable(profile,data);

    if (!payable) {
        return res.send("Error adding expense")
    }

    return res.send("Payable added");
}

export async function deletePayable(req: Request, res: Response) {
    const userId = Number(res.locals.currentUserId);
    const user = await getUserById(userId);

    if (user === null) {
        return res.send("User does not exist")
    }

    const profile = await getProfileById(user.profile.id);

    if (profile === null) {
        return res.send("Profile does not exist")
    }

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

    const userId = Number(res.locals.currentUserId);
    const user = await getUserById(userId);

    if (user === null) {
        return res.send("User does not exist")
    }
    const profile = await getProfileById(user.profile.id);

    if (profile === null) {
        return res.send("Profile does not exist")
    }

    const payableId = data.id;
    const payable = await getPayableById(payableId);
    const updatedPayable = await patchExistingEPayable(payable, profile, data);

    if (updatedPayable) {
        return res.send("Failed to patch payable")
    }

    return res.send("Patched payable");
}