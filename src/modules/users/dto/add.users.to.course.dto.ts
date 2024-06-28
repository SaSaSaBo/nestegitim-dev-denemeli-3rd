import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class AddUsersToCourseDto {

    @IsInt()
    userId: number;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    courseIds: number[];

}