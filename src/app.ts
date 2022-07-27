import express  from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./user/user.routes"
import expenseRoutes from "./expense/expense.routes";
import transactionsRoutes from "./analytics/analytics.routes";
import payableRoutes from "./payable/payable.routes";
import receivableRoutes from "./receivable/receivable.routes";
import routeLogger from "./utils/logger/src/routeLogger.middleware";
import errorHandler from "./utils/error_handling/errorHandler.middleware";
import logger from "./utils/logger/src/logger";
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(routeLogger);

userRoutes(app);
expenseRoutes(app);
payableRoutes(app);
receivableRoutes(app);
transactionsRoutes(app);

app.use(errorHandler);

AppDataSource.initialize().then(async () => {
    logger.log("info","Database connected")
}).catch(error => console.log(error))

export default app