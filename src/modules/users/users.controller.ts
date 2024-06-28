import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserLoginDto } from './dto/users.login.dto';
import { UsersService } from './users.service';
import { UserRegisterDto } from './dto/users.register.dto';
import { UserUpdateDto } from './dto/users.update.dto';
import { UserPasswordChangeDto } from './dto/users.passwordChange.dto';
import { UsersDeleteDto } from './dto/users.delete.dto';
import { AddUsersToCourseDto } from './dto/add.users.to.course.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post('register')
  async register(@Body() data: UserRegisterDto) {
    return this.userService.register(data);
  }  

  @Post('login')
  async login(@Body() data: UserLoginDto) {
    const user = await this.userService.login(data);
    return { success: true, message: 'Kullanıcı başarıyla giriş yaptı.'};
  }
  
  @Post('logout')
  async logout(@Body() data: UserLoginDto) {
    await this.userService.logout(data);
    return { success: true, message: 'Kullanıcı başarıyla çıkış yaptı.' };
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UserUpdateDto)
     {

    return this.userService.update(id, data);
  }

  @Put('password')
  async changepassword(
    @Body() data: UserPasswordChangeDto)
  {
    return this.userService.changepassword(data);
  }

  @Delete('delete/:id')
  async deleteUser(@Body() deleteUserDto: UsersDeleteDto): Promise<{ message: string }> {  
    try {
      const message = await this.userService.delete(deleteUserDto);
      return { message };
    } catch (error) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      } 
  }

  @Post('add')
  async addUserToCourses(@Body() addUsersToCourseDto: AddUsersToCourseDto) {
    return this.userService.addUserToCourses(addUsersToCourseDto);
  }

  @Post('refresh')
  async refresh(@Body() data: RefreshDto) {
    return this.userService.refreshTokens(data.refreshToken);
  }

}
