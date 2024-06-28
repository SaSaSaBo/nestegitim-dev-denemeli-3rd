import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';

@Module({
  providers: [PasswordService],
  exports: [PasswordService], // PasswordService'i diğer modüllerin de kullanabilmesi için export et
})
export class PasswordModule {}