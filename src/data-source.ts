import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./user/entity/User"
import { Expense } from "./expense/entity/Expense"
import { Profile } from "./user_profile/entity/User_profile"
import { Payable } from "./payable/entity/Payable"
import { Receivable } from "./receivable/entity/Receivable";
require("dotenv").config();

const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env

export const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Expense, Profile, Payable, Receivable],
    migrations: [],
    subscribers: [],
})
