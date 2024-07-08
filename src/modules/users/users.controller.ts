import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserLoginDto } from './dto/users.login.dto';
import { UsersService } from './users.service';
import { UserRegisterDto } from './dto/users.register.dto';
import { UserUpdateDto } from './dto/users.update.dto';
import { UserPasswordChangeDto } from './dto/users.passwordChange.dto';
import { UsersDeleteDto } from './dto/users.delete.dto';
import { AddUsersToCourseDto } from './dto/add.users.to.course.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard } from './guards/auth.guard';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { Role } from './enum/role.enum';
import { Roles } from './decorator/roles.decorator';
import { Permissions } from './decorator/permissions.decorator';
import { RoleGuard } from './guards/role.guard';
import { PermissionGuard } from '../permission/permission.guard';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
  ) {}

  @Get('findall')
  // @SetMetadata('roles', [Role.ADMIN]) 
  @UseGuards(AuthGuard, RoleGuard, PermissionGuard)
  @Permissions('view_courses')
  // custom decorator allows only admins to access this route. But we made a roles.decorator.ts file for roles. So instead of using that we gonna use:
  @Roles(Role.Master, Role.Admin) //it's same as @SetMetadata('roles', [Role.ADMIN])
  async findAll() {
    return this.userService.findAll();
  }

  @Post('register')
  async register(
    @Body() data: UserRegisterDto) {
    return this.userService.register(data);
  }  

  @Post('login')
  async login(
    @Body() data: UserLoginDto) {
    const user = await this.userService.login(data);
    return { success: true, message: 'Kullanıcı başarıyla giriş yaptı.'};
  }
  
  @Post('logout')
  async logout(
    @Body() data: UserLoginDto) {
    await this.userService.logout(data);
    return { success: true, message: 'Kullanıcı başarıyla çıkış yaptı.' };
  }

  @Post('add')
  @UseGuards(AuthGuard, RoleGuard, PermissionGuard)
  @Permissions('add_users_to_courses')
  @Roles(Role.Master)
  async addUserToCourses(
    @Body() addUsersToCourseDto: AddUsersToCourseDto) {
    return this.userService.addUserToCourses(addUsersToCourseDto);
  }

  @Post('refresh')
  async refresh(
    @Body() data: RefreshDto) {
    return this.userService.refreshTokens(data.refreshToken);
  }

  @Post('forgotPassword')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);    
  }

  @Put('update/:id')
  @UseGuards(AuthGuard, RoleGuard, PermissionGuard)
  @Permissions('update_own_profile', 'update_users')
  @Roles(Role.Master, Role.User, Role.Admin)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UserUpdateDto)
     {

    return this.userService.update(id, data);
  }

  // @UseGuards(AuthGuard, RoleGuard) idk why i added this
  @Put('changePassword/:id')
  async changepassword(
    @Body() changePasswordDto: UserPasswordChangeDto, 
    @Req() req,
  ) {
    return this.userService.changepassword(
      req.userId, 
      changePasswordDto
    );
  }

  @Put('resetPassword')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto){
    return this.userService.resetPassword(
      resetPasswordDto.new_password, 
    resetPasswordDto.resetToken
    );
  }

/*
  @Put('password')
  async changepassword(
    @Body() data: UserPasswordChangeDto)
  {
    return this.userService.changepassword(data);
  }
*/

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard, PermissionGuard)
  @Permissions('delete_own_profile', 'delete_users')
  @Roles(Role.Master, Role.Admin, Role.User)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) deleteUserDto: UsersDeleteDto): Promise<{ message: string }> {  
    try {
      const message = await this.userService.delete(id, deleteUserDto);
      return { message };
    } catch (error) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      } 
  }

}