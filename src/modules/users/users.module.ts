import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { PasswordModule } from './password/password.module'; // PasswordModule'ü import et
import { UserlogService } from '../userlog/userlog.service';
import { UserlogEntity } from '../userlog/userlog.entity';
import { LogcontrolEntity } from '../logcontrol/logcontrol.entity';
import { LogControlService } from '../logcontrol/logcontrol.service';
import { AuthService } from '../logcontrol/auth/auth.service';
import { CoursesEntity } from '../courses/courses.entity';
import { CoursesService } from '../courses/courses.service';
import { RefreshTokenEntity } from './entity/refresh.token.entity';
import { ResetTokenEntity } from './entity/reset.token.entity';
import { EmailService } from './service/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity,CoursesEntity, UserlogEntity, LogcontrolEntity, RefreshTokenEntity, ResetTokenEntity]), PasswordModule, 
  ], 

  controllers: [UsersController],
  providers: [UsersService, UserlogService, LogControlService, AuthService, CoursesService, EmailService],

})
export class UsersModule {}
