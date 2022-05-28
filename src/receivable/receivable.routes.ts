import Express from "express";
import { getReceivable, addReceivable, deleteReceivable, updateReceivable } from "./receivable.controller"
import { verify } from "../authentication/auth.middleware"
import { profile } from "../user_profile/user_profile.middleware";

function receivableRoutes(app: Express.Application) {
    app.get("/api/v0/receivable/:id", verify, profile, getReceivable)
    app.post("/api/v0/receivable", verify, profile, addReceivable)
    app.delete("/api/v0/receivable/:id", verify, profile, deleteReceivable)
    app.patch("/api/v0/receivable", verify, profile, updateReceivable)
}

export default receivableRoutes;