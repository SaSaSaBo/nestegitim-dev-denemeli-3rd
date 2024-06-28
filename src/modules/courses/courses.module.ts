import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesEntity } from './courses.entity';
import { UsersEntity } from '../users/users.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([CoursesEntity, UsersEntity])],
  providers: [CoursesService],
  controllers: [CoursesController]
})
export class CoursesModule {}
