import { Module } from '@nestjs/common';
import { LogcontrolController } from './logcontrol.controller';
import { LogControlService } from './logcontrol.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogcontrolEntity } from './logcontrol.entity';
import { UsersEntity } from '../users/users.entity';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [TypeOrmModule.forFeature([LogcontrolEntity, UsersEntity]), UsersModule],
  controllers: [LogcontrolController],
  providers: [LogControlService],
  exports: [LogControlService],
})
export class LogcontrolModule {}
