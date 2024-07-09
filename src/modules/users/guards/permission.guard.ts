import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roles } from '../enum/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]) || [];

    console.log('PermissionGuard çalışıyor...');

    console.log('Required permissions:', requiredPermissions);

    if (!requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      const decodedToken = this.jwtService.decode(token) as { role: string, sub: number }; // Örneğin, JWT içinde 'role' alanını kullanarak rolü alabilirsiniz

      const userRole = decodedToken.role;
      const userId = decodedToken.sub;
      const requestedUserId = +request.params.id; // Get the ID from the request params
      const body = request.body;

      // Kullanıcı rolüne göre izinleri almak
      const userPermissions = roles[userRole];

      if (!userPermissions) {
        console.error('User permissions not found for role:', userRole);
        return false;
      }

      console.log('User permissions:', userPermissions);      

      // Kullanıcı kendi profilini güncellerken
      if (requiredPermissions.includes('update_own_profile') && requestedUserId === userId) {
        if (body.role && body.role !== userRole) {
          throw new ForbiddenException('You cannot change your own role.');
        }
        return true;
      }

      // Başka kullanıcıları güncellerken
      if (requiredPermissions.includes('update_users')) {
        if (userRole === 'master' || (userRole === 'admin' && !body.role)) {
          return true;
        } else {
          throw new ForbiddenException('Admins cannot update roles of other users.');
        }
      }

      // Kendi profilini silerken
      if (requiredPermissions.includes('delete_own_profile') && requestedUserId === userId) {
        return true;
      }

      // Başka kullanıcıları silerken
      if (requiredPermissions.includes('delete_users') && (userRole === 'master' || userRole === 'admin')) {
        return true;
      }

      // Gerekli izinleri kontrol etmek
      const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
      if (!hasPermission) {
        console.log('Insufficient permissions.');
      }

      return true;
    } catch (err) {
      console.error("Error decoding JWT token:", err);
      return false;
    }
  }
}
