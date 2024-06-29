import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserLoginDto } from './modules/users/dto/users.login.dto';
import { AuthGuard } from './modules/users/guards/auth.guard';


@UseGuards(AuthGuard)
@Controller()
export class AppController {
  // constructor() {}

  @Post()
  async test(@Body() data: UserLoginDto) {
    console.log(data);
  }

  @Get()
  someProtectedRoute(@Req() req) {
    console.log(req.userId);
    
    return {
      message: 'some protected route',
      userId: req.userId,
    };
  }

}

/*
  This code fragment defines a controller class built using NestJS. The purpose and function of the code is as follows:
  Controller Structure
  1. `@UseGuards(AuthGuard)` Decorator: This decorator specifies that all methods of the `AppController` class (`test` and `someProtectedRoute`) will use a guard named `AuthGuard`. That is, this guard will check each request and provide authorisation.
  2. `@Controller()` Decorator: Specifies that the `AppController` class is a NestJS controller. This decorator defines which route the class will listen on and which type of HTTP requests it will respond to. In this case, no specific path is specified, so by default all requests will be directed to this controller.
  3. `@Post()` Method: It is a method that handles HTTP POST requests. It binds the data in the body of the request with the `@Body()` decorator to the `data` parameter and writes this data to the console (`console.log(data)`).
  4. `@Get()` Method: It is a method that processes HTTP GET requests. It binds the request received with the `@Req()` decorator to the `req` parameter. This method prints the user's ID (`req.userId`) to the console and returns a JSON object. This object contains the user ID and the fact that some protected path is accessible to the user.
  Summary
  - Controller Decorator (`@Controller`): Indicates that the `AppController` class is a NestJS controller.
  - Guard Decorator (`@UseGuards`): Specifies to use the `AuthGuard` guard for all methods.
  - Methods:
    - `@Post()`: Processes HTTP POST requests, prints the incoming data to the console.
    - `@Get()`: Processes HTTP GET requests, prints the user ID to the console, and returns a JSON object indicating that a protected path is accessible.
  This structure demonstrates that NestJS is strongly configurable and modular. In this example, we can see how a RESTful API is built using guards, data transfer objects (DTOs), middleware and HTTP request handling methods.
*/