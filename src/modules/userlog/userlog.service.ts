import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserlogEntity } from './userlog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserlogService {

  constructor(
    @InjectRepository(UserlogEntity)
    private userlogRepository: Repository<UserlogEntity>,
  ) {}

  async addLog(data: UserlogEntity): Promise<UserlogEntity> {
    try {
      return this.userlogRepository.save(data);
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getLogs(userId: number): Promise<UserlogEntity[]> {
    try {
      return await this.userlogRepository.find({ where: { user: { id: userId } } });
    } catch (error) {
      throw new Error(error.message);
    }
  }

}
