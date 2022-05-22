import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne } from "typeorm"
import { Expense } from "../../expense/entity/Expense"
import { User } from "../../user/entity/User"

@Entity()
export class Profile extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, (user) => user.profile)
    user: User

    @OneToMany(() => Expense, (expense) => expense.profile)
    expense: Expense[]

}
