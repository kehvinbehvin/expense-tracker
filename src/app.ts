// Dependencies
import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata"
import logger from "./utils/logger/src/logger";

// Database Connection
import { AppDataSource } from "./data-source";

// Routes (Import custom routes here)
// eg: Import serviceRoute from "./<service>/<RouteFile>"
import userRoutes from "./user/user.routes"
import expenseRoutes from "./expense/expense.routes";
import transactionsRoutes from "./analytics/analytics.routes";
import payableRoutes from "./payable/payable.routes";
import receivableRoutes from "./receivable/receivable.routes";

// Middleware
import routeLogger from "./utils/logger/src/routeLogger.middleware";
import errorHandler from "./utils/error_handling/errorHandler.middleware";
var cors = require('cors')

const app: Express = express();
const port = process.env.PORT;

var corsOptions = {
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200 
  }

// Middleware before module routing
app.use(cors(corsOptions));
app.use(express.json());
app.use(routeLogger);

// Initialise custom routes here
// eg: serviceRoutes(app)
userRoutes(app);
expenseRoutes(app);
payableRoutes(app);
receivableRoutes(app);
transactionsRoutes(app);

// Middleware after module routing
app.use(errorHandler);

AppDataSource.initialize().then(async () => {
    logger.log("info","Database connected")
}).catch(error => console.log(error))


app.listen(port, () => {
    logger.log("info",`Server is running on port ${port}`);
})