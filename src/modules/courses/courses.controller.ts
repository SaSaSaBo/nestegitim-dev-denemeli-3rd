import { CoursesService } from './courses.service';
import { Body, Controller, Delete, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CoursesAddDto } from './dto/add.course.dto';
import { CoursesDeleteDto } from './dto/delete.course.dto';

@Controller('courses')
export class CoursesController {

    constructor(private readonly CoursesService: CoursesService
    ) {}

    @Post('add')
    async add(@Body() data: CoursesAddDto) {
      return this.CoursesService.add(data);
    }  

    @Delete('delete/:id')
    async deleteUser(@Body() coursesDeleteDto: CoursesDeleteDto): Promise<string> {  
      try {
        const message = await this.CoursesService.delete(coursesDeleteDto);
        return 
    } catch (error) { 
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          }, HttpStatus.BAD_REQUEST);
        } 
    }

}
