import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ResetToken')
export class ResetTokenEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column( {
        nullable: true,
    })
    resetToken: string;

    @Column()
    userId: number;

    @CreateDateColumn()
    resetTokenExpiryDate: Date;

}
