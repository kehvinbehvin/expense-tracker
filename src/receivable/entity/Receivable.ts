import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm"
import { Profile } from "../../user_profile/entity/User_profile"

@Entity()
export class Receivable extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "float" })
    amount: number

    @Column({ type: "datetime" })
    transaction_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column({ type: "datetime" })
    repayment_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column({ type: "datetime" })
    expected_repayment_date: string // 'YYYY-MM-DD hh:mm:ss'

    @Column("varchar", { length: 200 })
    description: string

    @Column("varchar", { length: 200 })
    category: string

    @Column("varchar", { length: 200 })
    debtor: string

    @ManyToOne(() => Profile, (profile) => profile.receivable)
    profile: Profile
}
