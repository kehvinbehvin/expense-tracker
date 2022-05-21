import Express from "express";
import {getUser, registerUser, deleteUser, patchUser, login} from "./users.controller"

function userRoutes(app: Express.Application) {
    app.get("/api/v0/user/:id", getUser)
    app.post("/api/v0/register", registerUser)
    app.delete("/api/v0/user/:id", deleteUser)
    app.patch("/api/v0/user", patchUser)
    app.post("/api/v0/login", login)
}

export default userRoutes;