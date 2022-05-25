import Express from "express";
import { getPayable, addPayable, deletePayable, updatePayable } from "./payable.controller"
import { verify } from "../authentication/auth.middleware"

function payableRoutes(app: Express.Application) {
    app.get("/api/v0/payable/:id", verify, getPayable)
    app.post("/api/v0/payable", verify, addPayable)
    app.delete("/api/v0/payable/:id", verify, deletePayable)
    app.patch("/api/v0/payable", verify, updatePayable)
}

export default payableRoutes;