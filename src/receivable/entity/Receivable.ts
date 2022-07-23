import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm"
import { Profile } from "../../user_profile/entity/User_profile"

@Entity({name: "receivable"})
export class Receivable extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true, type: "float" })
    amount: number

    @Column({ nullable: true, type: "timestamp" })
    transaction_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column({ nullable: true, type: "timestamp", default: null })
    repayment_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column({ nullable: true, type: "timestamp", default: null })
    expected_repayment_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column("varchar", { nullable: true, length: 200 })
    description: string

    @Column("varchar", { nullable: true, length: 200 })
    category: string

    @Column("varchar", { nullable: true, length: 200 })
    debtor: string

    @ManyToOne(() => Profile, (profile) => profile.receivable)
    profile: Profile
}
