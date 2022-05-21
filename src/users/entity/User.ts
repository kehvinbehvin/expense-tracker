import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { Expense } from "../../expense/entity/Expense"

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { length: 200 })
    firstName: string

    @Column("varchar", { length: 200 })
    lastName: string

    @Column("varchar", { length: 200 })
    email: string

    @Column("varchar", { length: 200 })
    password: string

    @OneToMany(() => Expense, (expense) => expense.user) // note: we will create author property in the Photo class below
    expense: Expense[]

}
