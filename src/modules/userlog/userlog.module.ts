import { Module } from '@nestjs/common';
import { UserlogController } from './userlog.controller';
import { UserlogService } from './userlog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserlogEntity } from './userlog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserlogEntity])],
  controllers: [UserlogController],
  providers: [UserlogService],
  exports: [UserlogService],
})
export class UserlogModule {}
