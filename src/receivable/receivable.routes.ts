import Express from "express";
import { getReceivable, addReceivable, deleteReceivable, updateReceivable } from "./receivable.controller"
import { verify } from "../authentication/auth.middleware"

function receivableRoutes(app: Express.Application) {
    app.get("/api/v0/receivable/:id", verify, getReceivable)
    app.post("/api/v0/receivable", verify, addReceivable)
    app.delete("/api/v0/receivable/:id", verify, deleteReceivable)
    app.patch("/api/v0/receivable", verify, updateReceivable)
}

export default receivableRoutes;