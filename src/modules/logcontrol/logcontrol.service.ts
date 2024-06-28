import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LogcontrolEntity } from './logcontrol.entity';
import { UsersEntity } from '../users/users.entity';
import { UserlogEntity } from '../userlog/userlog.entity';

@Injectable()
export class LogControlService {
  getUserLogs(username: string) {
  return this.logControlRepository.find({ where: { user: { username } }, order: { inOutDate: 'ASC' } });

  }
  constructor(
    @InjectRepository(LogcontrolEntity)
    private logControlRepository: Repository<LogcontrolEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(UserlogEntity)
    private userlogRepository: Repository<UsersEntity>,
  ) {}

  async logAction(username: string, action: string): Promise<LogcontrolEntity> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('Kullanıcı bulunamadı!');
    }

    const log = new LogcontrolEntity();
    log.inOut = action;
    log.user = user;
    log.inOutDate = new Date();

    return this.logControlRepository.save(log);
  }

  async logoutAction(username: string, action: string): Promise<LogcontrolEntity> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('Kullanıcı bulunamadı!');
    }
    const log = new LogcontrolEntity();
    log.inOut = action;
    log.inOutDate = new Date();

    return this.logControlRepository.save(log);
  }

}
