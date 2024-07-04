import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesAddDto } from './dto/add.course.dto';
import { CoursesDeleteDto } from './dto/delete.course.dto';
import { Repository } from 'typeorm';
import { CoursesEntity } from './courses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CoursesEntity)
        private CRepository: Repository<CoursesEntity>,

        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,

    ) {}

    findAll() {
        return this.CRepository.find();
    } 

    async addUserToCourse(courseId: number, userId: number): Promise<void> {
        const course = await this.CRepository.findOne({
          where: { id: courseId },
          relations: ['users'],
        });
        const user = await this.usersRepository.findOne({
          where: { id: userId },
        });
    
        if (course && user) {
          course.users.push(user);
          await this.CRepository.save(course);
        }
      }

    async add(courseData: CoursesAddDto): Promise<CoursesEntity> {
        try {
            const newCourse = this.CRepository.create(courseData);
            const savedCourse = await this.CRepository.save(newCourse);

            return savedCourse;

        } catch (error) {
            throw error;
        }
    }

    async delete(courseData: CoursesDeleteDto) {
        try {
            const { coursename, softDelete } = courseData;
            const course = await this.CRepository.findOne({ where: { coursename } });

            if (!course) {
                throw new NotFoundException('Course not found');
            }

            if (softDelete === true) {
                course.deletedAt = new Date();
                await this.CRepository.save(course);
                return 'Kurs soft delete ile silindi!';
            } else {
                await this.CRepository.remove(course);
                return 'Kurs hard delete ile silindi!';
            }
        } catch (error) {
            throw error;
        }
    }
    
}
