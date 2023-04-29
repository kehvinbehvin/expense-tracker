import { Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, OneToOne } from "typeorm"
import { Expense } from "../../expense/entity/Expense"
import { User } from "../../user/entity/User"
import { Payable } from "../../payable/entity/Payable"
import { Receivable } from "../../receivable/entity/Receivable";

@Entity()
export class Profile extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, (user) => user.profile)
    user: User

    @OneToMany(() => Expense, (expense) => expense.profile)
    expense: Expense[]

    @OneToMany(() => Payable, (payable) => payable.profile)
    payable: Payable[]

    @OneToMany(() => Receivable, (receivable) => receivable.profile)
    receivable: Receivable[]
}
