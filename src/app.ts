import express, {Request, Response, NextFunction}  from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./user/user.routes"
import expenseRoutes from "./expense/expense.routes";

const app = express();

app.use(express.json());

userRoutes(app);
expenseRoutes(app);

AppDataSource.initialize().then(async () => {
    console.log("Database connected")
}).catch(error => console.log(error))


app.listen(3000, () => {
    console.log("Application listening at port 3000")
})