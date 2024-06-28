import { IsString } from "class-validator";

export class CoursesAddDto {

    @IsString()
    coursename: string;

}