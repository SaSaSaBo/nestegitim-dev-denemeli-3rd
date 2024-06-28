import { IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength, } from 'class-validator';
import { UsersEntity } from '../users.entity';

export class UserRegisterDto{

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    phone: string;

    @MinLength(6)
    @MaxLength(10)
    password:string;

    @MinLength(6)
    @MaxLength(10)
    password_confirm:string;
    hashedPassword: string;
   
    toEntity(): UsersEntity {
        const user = new UsersEntity();
        user.username = this.username;
        user.email = this.email;
        user.phone = this.phone;
        user.password = this.hashedPassword;
        return user;
    }

}


  
