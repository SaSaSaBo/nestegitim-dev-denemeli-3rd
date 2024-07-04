import { CoursesService } from './courses.service';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CoursesAddDto } from './dto/add.course.dto';
import { CoursesDeleteDto } from './dto/delete.course.dto';
import { Roles } from '../users/roles/roles.decorator';
import { Role } from '../users/enum/role.enum';
import { RoleGuard } from '../users/guards/role.guard';
import { AuthGuard } from '../users/guards/auth.guard';


@Controller('courses')
export class CoursesController {

    constructor(private readonly coursesService: CoursesService
    ) {}

    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async findAll() {
      return this.coursesService.findAll();
    }

    @Post('add')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async add(@Body() data: CoursesAddDto) {
      return this.coursesService.add(data);
    }  

    @Delete('delete/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async deleteUser(@Body() coursesDeleteDto: CoursesDeleteDto): Promise<string> {  
      try {
        const message = await this.coursesService.delete(coursesDeleteDto);
        return 
    } catch (error) { 
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          }, HttpStatus.BAD_REQUEST);
        } 
    }

}
