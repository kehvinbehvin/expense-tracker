import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne } from "typeorm"
import { Expense } from "../../expense/entity/Expense"
import { ExpUser } from "../../user/entity/ExpUser"
import { Payable } from "../../payable/entity/Payable"
import { Receivable } from "../../receivable/entity/Receivable";

@Entity({name: "profile"})
export class Profile extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => ExpUser, (user) => user.profile)
    user: ExpUser

    @OneToMany(() => Expense, (expense) => expense.profile)
    expense: Expense[]

    @OneToMany(() => Payable, (payable) => payable.profile)
    payable: Payable[]

    @OneToMany(() => Receivable, (receivable) => receivable.profile)
    receivable: Receivable[]
}
