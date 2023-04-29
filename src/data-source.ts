import "reflect-metadata"
import { DataSource } from "typeorm"
import fs from "fs"

// Import custom schemas here
// eg: import { User } from "./<service>/<schemaFile>"
import { User } from "./user/entity/User"
import { Expense } from "./expense/entity/Expense"
import { Profile } from "./profile/entity/Profile"
import { Payable } from "./payable/entity/Payable"
import { Receivable } from "./receivable/entity/Receivable";

import dotenv from 'dotenv';
dotenv.config();

const {
    LOCAL_DATABASE_URL,
    NODE_ENV,
    DATABASE_URL
    } = process.env

function getDataSource() {
    if (NODE_ENV === "development") {
        return new DataSource({
            type: "postgres",
            url: LOCAL_DATABASE_URL,
            synchronize: true,
            logging: true,
            entities: [User, Expense, Profile, Payable, Receivable],
            subscribers: [],
            migrations: [],
            ssl: {
                ca: fs.readFileSync('./private/local-certificate.crt').toString()
            },
        })
    } else {
        return new DataSource({
            type: "postgres",
            url: DATABASE_URL,
            synchronize: true,
            logging: true,
            entities: [User, Expense, Profile, Payable, Receivable],
            migrations: [],
            subscribers: [],
            ssl: {
                ca: process.env.SSL_CERT
            },
        })
    }
}

const AppDataSource = getDataSource()

export { AppDataSource }