import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RefreshToken')
export class RefreshTokenEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    refreshToken: string;

    @Column()
    userId: number;

    @CreateDateColumn()
    refreshTokenExpiryDate: Date;

    @Column()
    accessToken: string;
    
    @Column()
    accessTokenExpiryDate: Date;
    

}
