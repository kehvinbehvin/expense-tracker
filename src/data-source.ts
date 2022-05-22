import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./users/entity/User"
import { Expense } from "./expense/entity/Expense"
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
    entities: [User,Expense],
    migrations: [],
    subscribers: [],
})
