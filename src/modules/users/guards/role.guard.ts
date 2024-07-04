/*
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enum/role.enum";
import { UsersService } from "../users.service";
import { UsersEntity } from "../users.entity";

@Injectable()
export class RoleGuard implements CanActivate{

    constructor(
        private reflector: Reflector,
        private usersService: UsersService, 
    ) {}

    canActivate(context: ExecutionContext): boolean { 
        // from vsc after boolean: | Promise<boolean> | Observable<boolean> {
        // what is the require role?
        // in here need the figure it out what permissions that might does user have.....
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        // gist of is using the this.reflector is that it's used to read the metadata from the @Roles(Role.ADMIN) decorator we provided in the users.controller.ts.            
            'roles', [
            context.getHandler(),
            context.getClass(),
            // gist of this part is just that it's trying to pull in the metadata for that specific context of making a create user request is that it's in the users.controller.ts and the methods. And this part is create method right that's what this context stuff trying to do trying to figure it out what you know where is this happening.
            // requiredRoles if done correctly is gonna have Role.ADMIN for create request. 
        ]);

        console.log('--->', requiredRoles);


        if(!requiredRoles) {
            return true;
        }
        //if there is no required roles it's just going to return true for each one of the requests in users.controller.ts. 

        // const request = context.switchToHttp().getRequest();
        // const userId = request.user;
        const  user = {
            name: UsersEntity.name,
            roles: [Role.ADMIN],
        }        

        if (!user) {
            return false;
        }

        // does the current user making the request have those required roles?
        return requiredRoles.some((role) => user.roles.includes(role));
        // .....also need to be able to do something similar to this.  

    }
}
*/

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enum/role.enum";
import { UsersService } from "../users.service";
import { UsersEntity } from "../users.entity";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        try {

            const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
                'roles',
                [
                    context.getHandler(),
                    context.getClass(),
                ]
            );

            console.log('---> Required Roles:', requiredRoles);

            if (!requiredRoles) {
                return true; // Eğer gerekli roller belirtilmemişse izin ver
            }

            const request = context.switchToHttp().getRequest();
            const userId = request.userId; // Kullanıcı kimliğini al, bu genellikle authentication middleware tarafından sağlanır
    // console.log(request);    

            console.log("User: " + userId);
        

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
