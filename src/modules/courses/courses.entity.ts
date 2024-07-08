import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity('courses')
export class CoursesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    coursename: string;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
        default: null,
    })
    deletedAt: Date;

    @ManyToMany(() => UsersEntity, (users) => users.courses)
    @JoinTable({ name: 'users_courses' })
    users: UsersEntity[];

    isAdded: boolean;

}
