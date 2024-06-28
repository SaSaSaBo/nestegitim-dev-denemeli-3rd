import { Injectable } from '@nestjs/common';
import { LogControlService } from '../logcontrol.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logControlService: LogControlService,
  ) {}

  async login(username: string): Promise<void> {
    // Your existing login logic
    await this.logControlService.logAction(username, 'login');
  }

  async logout(username: string): Promise<void> {
    // Your existing logout logic
    await this.logControlService.logAction(username, 'logout');
  }
}
