import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesEntity } from './courses.entity';
import { UsersEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { RefreshTokenEntity } from '../users/entity/refresh.token.entity';
import { ResetTokenEntity } from '../users/entity/reset.token.entity';
import { UserlogService } from '../userlog/userlog.service';
import { LogControlService } from '../logcontrol/logcontrol.service';
import { EmailService } from '../users/service/email.service';
import { AuthService } from '../logcontrol/auth/auth.service';
import { PasswordService } from '../users/password/password.service';
import { UserlogEntity } from '../userlog/userlog.entity';
import { LogcontrolEntity } from '../logcontrol/logcontrol.entity';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([
      CoursesEntity, 
      UsersEntity, 
      RefreshTokenEntity, 
      ResetTokenEntity,
      UserlogEntity,
      LogcontrolEntity,
    ]),
  ],
  providers: [
    CoursesService, 
    UsersService,
    PasswordService,
    UserlogService, 
    LogControlService, 
    AuthService, 
    CoursesService, 
    EmailService,
  ],
  controllers: [CoursesController]
})
export class CoursesModule {}
