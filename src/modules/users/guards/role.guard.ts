import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enum/role.enum";
import { UsersService } from "../users.service";

@Injectable()
export class RoleGuard implements CanActivate{

    constructor(
        private reflector: Reflector,
        private usersService: UsersService, 
    ) {}

    canActivate(context: ExecutionContext): boolean { 
        // from vsc after boolean: | Promise<boolean> | Observable<boolean> {
        // what is the require role?
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

        const request = context.switchToHttp().getRequest();
        const userId = request.user;
        // const  user = {
        //     name: UsersEntity.name,
        //     roles: [Role.ADMIN],
        // }        

        if (!userId) {
            return false;
        }

        const user = this.usersService.findOneById(userId);

        if (!user) {
            return false;
        }

        // does the current user making the request have those required roles?
        return requiredRoles.some((role) => userId.roles.includes(role));

    }
}