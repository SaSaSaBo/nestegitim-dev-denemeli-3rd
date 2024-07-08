import { CanActivate, ExecutionContext, Injectable, Body } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roles } from '../users/enum/role.enum';
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
      const decodedToken = this.jwtService.decode(token) as { role: string, sub: number }; //  }; Örneğin, JWT içinde 'role' alanını kullanarak rolü alabilirsiniz

      
      const userRole = decodedToken.role;
      const userId = decodedToken.sub;
      const requestedUserId = +context.switchToHttp().getRequest().params.id; // Get the ID from the request params

      // Kullanıcı rolüne göre izinleri almak
      const userPermissions = roles[userRole];

      if (!userPermissions) {
        console.error('User permissions not found for role:', userRole);
        return false;
      }

      if (requiredPermissions.includes('update_own_profile') && requestedUserId === userId) {
        return true;
      } else {
        console.log('User is not authorized to update other users.');
      }

      // Check if the user is trying to update other users
      if (requiredPermissions.includes('update_users')) {
        if (userRole === 'master' || userRole === 'admin') {
          return true;
        } 
          return false;
      }

      // Check if the user is trying to update their own profile
      if (requiredPermissions.includes('delete_own_profile') && requestedUserId === userId) {
        return true;
      } else {
        console.log('User is not authorized to delete other users.');
      }
      
      // Check if the user is trying to delete other users
      if (requiredPermissions.includes('delete_users')) {
        if (userRole === 'master' || userRole === 'admin') {
          return true;
        } 
        return false;
      }
    
      // Gerekli izinleri kontrol etmek
      return requiredPermissions.some(permission => userPermissions.includes(permission));
    } catch (err) {
      console.error("Error decoding JWT token:", err);
      return false;
    }
  }

}