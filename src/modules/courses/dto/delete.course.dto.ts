import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CoursesDeleteDto {

    @IsString()
    coursename: string;

    @IsOptional()
    @IsBoolean()
    softDelete?: boolean;
    static softDelete: boolean;
}
