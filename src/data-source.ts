import "reflect-metadata"
import { DataSource } from "typeorm"
import { ExpUser } from "./user/entity/ExpUser"
import { Expense } from "./expense/entity/Expense"
import { Profile } from "./user_profile/entity/User_profile"
import { Payable } from "./payable/entity/Payable"
import { Receivable } from "./receivable/entity/Receivable";
require("dotenv").config();

const {DB_HOST_POSTGRES, DB_PORT_POSTGRES, DB_DATABASE_POSTGRES, DB_USERNAME_POSTGRES, DB_PASSWORD_POSTGRES, DATABASE_URL, NODE_ENV } = process.env

// export const AppDataSource = new DataSource({
//     type: "mysql",
//     host: DB_HOST,
//     port: Number(DB_PORT),
//     username: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_DATABASE,
//     synchronize: true,
//     logging: false,
//     entities: [User, Expense, Profile, Payable, Receivable],
//     migrations: [],
//     subscribers: [],
// })

function getDataSource() {
    if (NODE_ENV === "development") {
        return new DataSource({
            type: "postgres",
            host: DB_HOST_POSTGRES,
            port: Number(DB_PORT_POSTGRES),
            username: DB_USERNAME_POSTGRES,
            password: DB_PASSWORD_POSTGRES,
            database: DB_DATABASE_POSTGRES,
            synchronize: true,
            logging: true,
            entities: [ExpUser, Expense, Profile, Payable, Receivable],
            migrations: [],
            subscribers: [],
        })
    } else {
        return new DataSource({
            type: "postgres",
            url: DATABASE_URL,
            username: DB_USERNAME_POSTGRES,
            password: DB_PASSWORD_POSTGRES,
            database: DB_DATABASE_POSTGRES,
            synchronize: true,
            logging: true,
            entities: [ExpUser, Expense, Profile, Payable, Receivable],
            migrations: [],
            subscribers: [],
        })
    }
}

const AppDataSource = getDataSource()

export { AppDataSource }
