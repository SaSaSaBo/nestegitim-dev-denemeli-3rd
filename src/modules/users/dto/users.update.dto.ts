import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength, } from 'class-validator';
import { UsersEntity } from "../users.entity";

export class UserUpdateDto {

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(50)
    new_username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    phone?: string;

    @MinLength(6)
    @MaxLength(10)
    current_password:string;

    @IsOptional()
    @MinLength(6)
    @MaxLength(10)
    new_password?:string;

    @IsOptional()
    @MinLength(6)
    @MaxLength(10)
    password_confirm?:string;

    hashedPassword: string;

    toEntity(user: UsersEntity): UsersEntity {
        if (this.new_username) {
            user.username = this.new_username;
        }
        if (this.email) {
            user.email = this.email;
        }
        if (this.phone) {
            user.phone = this.phone;
        }
        if (this.hashedPassword) {
            user.password = this.hashedPassword;
        }
        return user;
    }

}