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

/*
  This piece of code defines the main module (AppModule) of an application using NestJS. The purpose and function of the code is as follows:
  Main Structure
  1. `@Module` Decorator: Indicates that the `AppModule` class is a NestJS module. This decorator defines the module's relationships with other modules, controllers and providers.
  2. `imports`: This section specifies other modules that are included in `AppModule`.
    - `typeOrmDatabase`: A module used for database connection and configuration.
    - `UsersModule` and `CoursesModule`: Modules related to users and courses.
    - `JwtModule`: Module required for the use of JWT (JSON Web Token), configured globally and a secret key (`secret`) is specified.
  3. `controllers`: Specifies the controllers of the application.
    - `AppController`: Main controller class.
  4. `providers`: Specifies the providers of the application.
    - `AppService`: Main service class.
  Middleware Configuration
  5. **`configure` Method**: Configures middleware using `MiddlewareConsumer`.
    - `LoggerMiddleware` and `IpLoggerMiddleware`: Middleware for all paths (``'*'`) and HTTP methods (`RequestMethod.ALL`).
  Summary
  - Module Decorator (`@Module`): Specifies that `AppModule` is a NestJS module and identifies other modules, controllers and providers within it.
  - Middleware Configuration (`configure`): Implements two middleware (logger and IP logger) for all paths and HTTP methods.
  This structure allows the application to be modular and scalable. It also controls how the application handles specific requests using middleware.
*/