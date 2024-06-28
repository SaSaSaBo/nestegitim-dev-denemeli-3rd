import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { typeOrmDatabase } from './core/database';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { IpLoggerMiddleware } from './common/middleware/ip-logger/ip-logger.middleware';

import { CoursesModule } from './modules/courses/courses.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ...typeOrmDatabase, 
    UsersModule, 
    CoursesModule,
    JwtModule.register({
      global: true, 
      secret: 'cat'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(LoggerMiddleware, IpLoggerMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}