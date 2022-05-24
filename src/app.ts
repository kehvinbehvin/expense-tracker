import express  from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./user/user.routes"
import expenseRoutes from "./expense/expense.routes";
import transactionsRoutes from "./analytics/analytics.routes";

const app = express();

app.use(express.json());

userRoutes(app);
expenseRoutes(app);
transactionsRoutes(app);

AppDataSource.initialize().then(async () => {
    console.log("Database connected")
}).catch(error => console.log(error))


app.listen(3000, () => {
    console.log("Application listening at port 3000")
})