import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private jwtService: JwtService,    
    ) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);  

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = this.jwtService.verify(token);
            request.userId = payload.sub;
        } catch (e) {
            Logger.error(e.message);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const authHeader = request.headers['authorization']; 
        if (!authHeader) {
          return undefined;
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
          return undefined;
        }
        return token;
    }
    
}