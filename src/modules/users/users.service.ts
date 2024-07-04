import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/users.login.dto';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from './dto/users.register.dto'; 'hashedPassword?: stringto';
import { UserUpdateDto } from './dto/users.update.dto';
import { UserPasswordChangeDto } from './dto/users.passwordChange.dto';
import * as bcrypt from 'bcrypt';
import { PasswordService } from './password/password.service';
import { ResponseRegister } from './interface/response.register.interface';
import { UsersDeleteDto } from './dto/users.delete.dto';
import { UserlogService } from '../userlog/userlog.service';
import { UserlogEntity } from '../userlog/userlog.entity';
import { LogControlService } from '../logcontrol/logcontrol.service';
import { CoursesEntity } from '../courses/courses.entity';
import { AddUsersToCourseDto } from './dto/add.users.to.course.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenEntity } from './entity/refresh.token.entity';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { ResetTokenEntity } from './entity/reset.token.entity';
import { EmailService } from './service/email.service';


@Injectable()
export class UsersService {
  
  usersService: any;
  softDelete: Date;

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,

    @InjectRepository(CoursesEntity)
    private cRepository: Repository<CoursesEntity>,

    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,

    @InjectRepository(ResetTokenEntity) 
    private readonly resetRepository: Repository<ResetTokenEntity>,

    private passwordService:  PasswordService,
    private userlogService: UserlogService,
    private logControlService: LogControlService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  
  findAll() {
    return this.usersRepository.find();
  } 

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async register(data: UserRegisterDto): Promise<ResponseRegister> {
    try {
      const { password, password_confirm } = data;

      // Parolaların eşleştiğini kontrol et
      if (password !== password_confirm) {
        throw new InternalServerErrorException("Şifreler uyuşmuyor!");
      }

      // Parolayı hashle
      const hashedPassword = await this.passwordService.hashPassword(password);
      data.hashedPassword = hashedPassword; // hashedPassword özelliğine atama yapın

      // Yeni kullanıcıyı oluştur ve kaydet
      const new_user = data.toEntity();

      return await this.usersRepository
        .insert(new_user)
        .then((res) => {
          const response = new ResponseRegister
          response.statusCode = 201
          response.message = 'Kayıt oluştu'
          response.id = res.raw[0].id
          return response
        })
        .catch((e) => {
          throw new InternalServerErrorException(e.message || e);
        });
    } catch (error) {
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await this.passwordService.comparePassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

/*
  // async login(data: UserLoginDto) {
  //   try {
  //     const user = await this.checkAuth(data.username, data.password);
  //     if (user) {
  //       // Log user's login action
  //       await this.logControlService.logAction(user.username, 'login');

  //       // Generate JWT tokens
  //       const tokens = await this.generateUserTokens(user); 
  //       console.log(tokens);
  //       return { tokens };        
  //     }
  //     throw new NotFoundException('Şifre veya kullanıcı adı hatalı!');
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  This login method refreshing refreshToken and accessToken values  
*/   

  async login(data: UserLoginDto) {
    try {
        const user = await this.checkAuth(data.username, data.password);
        if (user) {
            // Log user's login action
            await this.logControlService.logAction(user.username, 'login');

            // Generate JWT tokens
            // const tokens = await this.generateUserTokens(user, this.jwtService.sign({ username: user.username, sub: user.id }));  actual one
            const tokens = await this.generateUserTokens(user); 
            console.log(tokens);
            return { tokens };        
        }
        throw new NotFoundException('Şifre veya kullanıcı adı hatalı!');
    } catch (error) {
        throw error;
    }
  }

  async logout(data: UserLoginDto) {
      try {
        const user = await this.checkAuth(data.username, data.password);
        if (user) {
          // Log user's login action
          // await this.logControlService.logAction(user.username, 'logout'); or we can use this

          // Fetch the user's log history
          const userLogs = await this.logControlService.getUserLogs(user.username);
          // Check if there's a "login" entry without a corresponding "logout" entry
          const hasLoggedInWithoutLogout = userLogs.some(log => log.inOut === 'login' && !userLogs.some(l => l.inOut === 'logout' && l.inOutDate > log.inOutDate));
    
          if (hasLoggedInWithoutLogout) {
            // Log user's logout action
            await this.logControlService.logAction(user.username, 'logout');
            return user;
          } else {
            throw new ForbiddenException('Kullanıcı önce giriş yapmalı!');
          }
        }
        // till here 

        throw new NotFoundException('Şifre veya kullanıcı adı hatalı!');
      } catch (error) {
        throw error;
      }
  }

  async checkAuth(username: string, password: string): Promise<UsersEntity | null> {
    console.log(`Checking auth for user: ${username}`);
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password match: ${isMatch}`);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

/*
  async changepassword(data: UserPasswordChangeDto) {
    try {
      const { id, current_password, new_password, password_confirm } = data;
  
      // Yeni şifre ve şifre onayının eşleşip eşleşmediğini kontrol et
      if (new_password !== password_confirm) {
        throw new InternalServerErrorException("Şifreler uyuşmuyor!");
      }
  
      const userdata = await this.usersRepository.findOne({ where: { id } });
      if (!userdata) {
        throw new NotFoundException('Kullanıcı bulunamadı!');
      }
      console.log('User data:', userdata);
  
      const user = await this.checkAuth(userdata.username, current_password); 
      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı!');
      }    
  
      // Mevcut şifrenin doğruluğunu kontrol et
      // Bunu `checkAuth` fonksiyonu zaten yaptı, bu yüzden tekrar kontrol etmeye gerek yok
  
      // Yeni şifreyi hashleyin ve güncelleyin
      const hashedPassword = await bcrypt.hash(new_password, 10);
      userdata.password = hashedPassword;
  
      await this.usersRepository.update(id, userdata);
  
      const log = new UserlogEntity();
      log.info = `Şifre değiştirildi.`;
      log.user = user;
      await this.userlogService.addLog(log);
  
      return {
        statusCode: 200,
        message: 'Şifre başarıyla güncellendi.',
      };
    } catch (error) {
      throw error;
    }
  }
*/
 
  async changepassword(userId: number, changePassword: UserPasswordChangeDto) {
    // Find the user by ID
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı!');
    }

    // Compare the old password with the hashed password in the database
    const isMatch = await bcrypt.compare(changePassword.current_password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Mevcut şifre yanlış!');
    }

    // Change user's password
    const hashedPassword = await bcrypt.hash(changePassword.new_password, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    const log = new UserlogEntity();
    log.info = `Şifre değiştirildi.`;
    log.user = user;
    await this.userlogService.addLog(log);

    return {
      statusCode: 200,
      message: 'Şifre başarıyla güncellendi.',
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{message: string}> {
    // Check that the user exists
    const user = await this.usersRepository.findOne({ where: { email: forgotPasswordDto.email } });

    if (user) {
      const resetTokenExpiryDate = new Date();
      resetTokenExpiryDate.setHours(resetTokenExpiryDate.getHours() + 1);
      // If user exists, generate a new password reset link

      const resetToken = uuidv4();
      await this.resetRepository.save({
        userId: user.id, 
        resetToken: resetToken, 
        resetTokenExpiryDate 
      });

      // Send the link to the user by email (using nodemailer/ SES/ etc...)
      this.emailService.sendPasswordResetEmail(user.email, resetToken);

    }

    return {message: "Sıfırlama linki e-posta adresinize gönderildi."};

  }

  async resetPassword(new_password: string, resetToken: string){
    // Find the reset token document
    const token = await this.resetRepository.findOne({ where: { resetToken, resetTokenExpiryDate: MoreThanOrEqual(new Date()) } });
    if (!token) {
      throw new NotFoundException('Sıfırlama kodu bulunamadı!');
    }

    // Change user password (MAKE SURE TO HASH) 
    const user = await this.usersRepository.findOne({ where: { id: token.userId } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı!');
    }

    user.password = await this.hashPassword(new_password);
    await this.usersRepository.save(user);
    await this.resetRepository.remove(token);

    return {message: "Sıfırlama işlemi tamamlandı."};

  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async addUserToCourses(dto: AddUsersToCourseDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: dto.userId },
      relations: ['courses'],
    });

    if (user) {
      for (const courseId of dto.courseIds) {
        const course = await this.cRepository.findOne({
          where: { id: courseId },
        });
        if (course && !user.courses.some(c => c.id === courseId)) {
          user.courses.push(course);
        }
      }
      await this.usersRepository.save(user);
    }
  }

  async update(id: number, data: UserUpdateDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: id, username: data.username } });

      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı!');
      }

      const updateMessages = [];
      const log = new UserlogEntity();
      log.user = user;

      if (data.new_username) {
        const isUsernameTaken = await this.usersRepository.findOne({ where: { username: data.new_username } });
        if (isUsernameTaken && isUsernameTaken.id !== user.id) {
          throw new InternalServerErrorException("Kullanıcı adı kullanılıyor!");
        }
        updateMessages.push('Kullanıcı adı değiştirildi!');
        log.info = log.info ? `${log.info} Kullanıcı adı değiştirildi.` : 'Kullanıcı adı değiştirildi.';
      }

      if (data.email && data.email !== user.email) {
        updateMessages.push('Email güncellendi!');
        log.info = log.info ? `${log.info} Email güncellendi.` : 'Email güncellendi.';
      }

      if (data.phone && data.phone !== user.phone) {
        updateMessages.push('Telefon numarası güncellendi!');
        log.info = log.info ? `${log.info} Telefon numarası güncellendi.` : 'Telefon numarası güncellendi.';
      }

      if (data.current_password) {
        const res = await this.passwordService.comparePassword(data.current_password, user.password);
        if (res !== true) {
          throw new InternalServerErrorException("Mevcut şifreniz hatalı!");
        }
      }

      let hashedPassword = user.password;
      if (data.new_password) {
        if (data.new_password !== data.password_confirm) {
          throw new InternalServerErrorException("Şifreler uyuşmuyor!");
        }
        hashedPassword = await this.passwordService.hashPassword(data.new_password);
      }

      const updatedUser = { 
        ...user, 
        username: data.new_username || user.username, 
        email: data.email || user.email, 
        phone: data.phone || user.phone, 
        password: hashedPassword 
      };
      await this.usersRepository.save(updatedUser);

      if (log.info) {
        await this.userlogService.addLog(log);
      }

      return {
        statusCode: 200,
        message: updateMessages.length > 0 ? updateMessages.join(' ') : 'Bilgileriniz güncellendi',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || error);
    }
  }

  async delete(deleteUserDto: UsersDeleteDto): Promise<string> {
      const { username, current_password, password_confirm } = deleteUserDto;
      try {
        const user = await this.usersRepository.findOne({ where: { username, deletedAt: null } });
        if (!user) {
          throw new NotFoundException('Kullanıcı bulunamadı!');
        }
        if (current_password !== password_confirm) {
          throw new BadRequestException('Şifreler uyuşmuyor!');
        }
        // şifre kontrolü
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
          throw new BadRequestException('Geçerli şifre yanlış!');
        }
        if (deleteUserDto.softDelete === true) {
          user.deletedAt = new Date();
          await this.usersRepository.save(user);
          return 'Kullanıcı soft delete ile silindi!';
        } else {
          await this.usersRepository.remove(user);
          return 'Kullanıcı hard delete ile silindi!';
        }
        // await this.usersRepository.remove(user);
      } catch (error) {
          if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error;
          } else {
            throw new Error('Kullanıcı silinirken bir hata oluştu!');
          }
        }
  }

/*
  async generateUserTokens(user: UsersEntity, accessToken: string) {
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, accessToken, user.id);
    return { refreshToken, accessToken };
  } 
    This generateUserTokens method refreshing refreshToken and accessToken values  
*/

  async generateUserTokens(user: UsersEntity) {

    const refreshToken = uuidv4();
    const accessToken = this.jwtService.sign({ username: user.username, sub: user.id, role: user.roles}, { expiresIn: '3h' });

    await this.storeRefreshToken(refreshToken, accessToken, user.id);
    return { refreshToken, accessToken };
  }

/*
  async storeRefreshToken( refreshToken: string, accessToken: string, userId: number) {
    const refreshTokenExpiryDate = new Date();
    refreshTokenExpiryDate.setDate(refreshTokenExpiryDate.getDate() + 3);

    const accessTokenExpiryDate = new Date();
    accessTokenExpiryDate.setDate(accessTokenExpiryDate.getDate() + 3);

    await this.refreshTokenRepository.manager.save(RefreshTokenEntity, {
      refreshToken,
      userId,
      refreshTokenExpiryDate,
      accessToken,
      accessTokenExpiryDate, // accessTokenExpiryDate'e expiryDate'i atayın  
    })
  } 
  This storeRefreshToken method refreshing refreshToken and accessToken values  

*/

  async storeRefreshToken(refreshToken: string, accessToken: string, userId: number) {
    const refreshTokenExpiryDate = new Date();
    refreshTokenExpiryDate.setDate(refreshTokenExpiryDate.getDate() + 3);

    const accessTokenExpiryDate = new Date();
    accessTokenExpiryDate.setDate(accessTokenExpiryDate.getDate() + 3);

    // Mevcut token'ı bul
    let token = await this.refreshTokenRepository.findOne({ where: { userId } });

    if (token) {
        // Mevcut token'ı güncelle
        token.refreshToken = refreshToken;
        token.accessToken = accessToken;
        token.refreshTokenExpiryDate = refreshTokenExpiryDate;
        token.accessTokenExpiryDate = accessTokenExpiryDate;
    } else {
        // Yeni token oluştur
        token = this.refreshTokenRepository.create({
            refreshToken,
            userId,
            refreshTokenExpiryDate,
            accessToken,
            accessTokenExpiryDate,
        });
    }

    await this.refreshTokenRepository.save(token);
  }

/*
  async storeRefreshToken(refreshToken: string, accessToken: string, userId: number) {
    const refreshTokenExpiryDate = new Date();
    refreshTokenExpiryDate.setDate(refreshTokenExpiryDate.getDate() + 3);

    const accessTokenExpiryDate = new Date();
    accessTokenExpiryDate.setDate(accessTokenExpiryDate.getDate() + 3);

    await this.refreshTokenRepository.manager.save(RefreshTokenEntity, {
        refreshToken,
        userId,
        refreshTokenExpiryDate,
        accessToken,
        accessTokenExpiryDate,
    });
  }
  This storeRefreshToken method refreshing refreshToken and accessToken values also adding a new record for the same user 
*/

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({ where: { refreshToken, refreshTokenExpiryDate: MoreThanOrEqual(new Date()) } });

  // console.log(token);

    if (!token) {
      throw new UnauthorizedException('Refresh token bulunamadı!');      
    }

  //  console.log(token);

    await this.refreshTokenRepository.remove(token);
    const user = await this.usersRepository.findOne({ where: { id: token.userId } });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı!');
    }
    return this.generateUserTokens(user);

    // return this.generateUserTokens(user, token.accessToken); actual one
    // return this.generateUserTokens( await this.usersRepository.findOne({ where: { id: token.userId } }))
  }

}