import { Entity, PrimaryGeneratedColumn, Column, BaseEntity,ManyToOne } from "typeorm"
import { Profile } from "../../user_profile/entity/User_profile"


@Entity({name: "expense"})
export class Expense extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true, type: "float" })
    amount: number

    @Column({ nullable: true, type: "timestamp" })
    expense_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column("varchar", { nullable: true, length: 200 })
    description: string

    @Column("varchar", { nullable: true, length: 200 })
    category: string

    @ManyToOne(() => Profile, (profile) => profile.expense)
    profile: Profile

}
