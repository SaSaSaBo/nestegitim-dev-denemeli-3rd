import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enum/role.enum";
import { UsersService } from "../users.service";
import { log } from "console";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        console.log('RolesGuard çalışıyor...');

        try {

            const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
                'roles',
                [
                    context.getHandler(),
                    context.getClass(),
                ]
            );

            console.log('Required roles:', requiredRoles);

            if (!requiredRoles) {
                return true; // Eğer gerekli roller belirtilmemişse izin ver
            }

            const request = context.switchToHttp().getRequest();
            const userId = request.userId; // Kullanıcı kimliğini al, bu genellikle authentication middleware tarafından sağlanır
    
        

            const user = await this.usersService.findOneById(userId); // Kullanıcıyı veritabanından bul
            if (!user) {
                return false; // Kullanıcı yoksa izin verme
            }

            console.log('User:', user);
            

            // Kullanıcının rollerini kontrol et
            return requiredRoles.some(role => user.roles.includes(role));

        } catch (err) {

            console.error("Error fetching user roles:", err);

            return false; // Kullanıcı rollerini alırken hata oluşursa izin verme

        }
    }
    
}
