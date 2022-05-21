import express, {Request, Response, NextFunction}  from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./users/users.routes"

const app = express();

app.use(express.json());

userRoutes(app);

AppDataSource.initialize().then(async () => {
    console.log("Database initialized")
}).catch(error => console.log(error))


app.listen(3000, () => {
    console.log("Application listening at port 3000")
})