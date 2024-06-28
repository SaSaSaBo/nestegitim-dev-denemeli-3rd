import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity('logcontrol')
export class LogcontrolEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersEntity, (user) => user.userId, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    user: UsersEntity;

    @Column()
    inOut: string;

    @Column( { nullable: true } )
    inOutDate: Date;

}

