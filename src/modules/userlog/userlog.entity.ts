import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity('userlog')
export class UserlogEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UsersEntity, (user) => user.id, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    user: UsersEntity;

    @Column('varchar')
    info: string;

    @CreateDateColumn()
    createdDate: Date;

}
