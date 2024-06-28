import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
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
    return {message: 'some protected route', userId: req.userId};
  }

}