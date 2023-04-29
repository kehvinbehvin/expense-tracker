import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { Profile } from "../../profile/entity/Profile"

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

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile
}
