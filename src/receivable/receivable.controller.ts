import {Request, Response} from "express";
import { completeKeys } from "../utils/utils"

export async function getReceivable(req: Request, res: Response) {
    return res.send("getReceivable");
}

export async function addReceivable(req: Request, res: Response) {
    return res.send("addReceivable");
}

export async function deleteReceivable(req: Request, res: Response) {
    return res.send("deleteReceivable");
}

export async function updateReceivable(req: Request, res: Response) {
    return res.send("updateReceivable");
}