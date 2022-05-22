import { Entity, PrimaryGeneratedColumn, Column, BaseEntity,ManyToOne } from "typeorm"
import { User } from "../../user/entity/User"


@Entity()
export class Expense extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "float" })
    amount: number

    @Column({ type: "datetime" })
    expense_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column("varchar", { length: 200 })
    description: string

    @Column("varchar", { length: 200 })
    category: string

    @ManyToOne(() => User, (user) => user.expense)
    user: User

}
