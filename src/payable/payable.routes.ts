import Express from "express";
import { getPayable, addPayable, deletePayable, updatePayable } from "./payable.controller"
import { verify } from "../authentication/auth.middleware"
import {profile} from "../user_profile/user_profile.middleware";

function payableRoutes(app: Express.Application) {
    app.get("/api/v0/payable/:id", verify, profile, getPayable)
    app.post("/api/v0/payable", verify, profile, addPayable)
    app.delete("/api/v0/payable/:id", verify, profile, deletePayable)
    app.patch("/api/v0/payable", verify, profile, updatePayable)
}

export default payableRoutes;