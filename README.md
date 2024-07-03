<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

Merhaba! Kullanıcı tablosunu sadece yetkili kullanıcıların görebileceği bir endpoint oluşturmak için aşağıdaki adımları izleyebilirsiniz:

### 1. Kullanıcı Modeli ve Yetkilendirme
Kullanıcı modelinizde (user.entity.ts) bir rol veya yetki alanı olduğunu varsayıyorum. Eğer yoksa, bir `role` veya `isAdmin` gibi bir alan ekleyebilirsiniz.

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;  // Bu alan yetki kontrolü için kullanılacak
}
```

### 2. Auth Guard
JWT token'ları doğrulamak ve kullanıcı yetkisini kontrol etmek için bir `AuthGuard` oluşturabilirsiniz.

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // kullanıcı bilgilerini request'e ekliyoruz
      return true;
    } catch (e) {
      return false;
    }
  }
}
```

### 3. Role Guard
Kullanıcının yetkisini kontrol eden bir `RoleGuard` oluşturun.

```typescript
// role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.isAdmin) {
      return true;
    }
    return false;
  }
}
```

### 4. Controller ve Route Koruması
Kullanıcı tablosunu döndüren endpoint'i ve yetki kontrolünü ayarlayın.

```typescript
// users.controller.ts
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RoleGuard) // İlk AuthGuard, sonra RoleGuard çalışır
  async findAll(@Req() request, @Res() response) {
    const users = await this.userService.findAll();
    return response.json(users);
  }
}
```

### 5. Kullanıcı Servisi
Kullanıcıları döndüren servis metodunu yazın.

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
```

### 6. Yetkisiz Erişim Mesajı
Yetkisiz kullanıcılar için özel bir mesaj döndürebilirsiniz.

```typescript
// role.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.isAdmin) {
      return true;
    }
    throw new ForbiddenException('Yetkiniz yoktur.');
  }
}
```

### 7. YouTube Arama Önerisi
Bu tür bir uygulamayı YouTube'da aramak için şu anahtar kelimeleri kullanabilirsiniz:
- "NestJS JWT Authentication and Authorization"
- "NestJS Role-based Access Control"
- "NestJS Guards Example"
- "NestJS JWT Guard and Role Guard"

Bu anahtar kelimelerle, gerekli videolara kolayca ulaşabilirsiniz.
