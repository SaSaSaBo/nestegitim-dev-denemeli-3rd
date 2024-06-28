import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

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
            request.userId = payload.userId;
        } catch (e) {
            Logger.error(e.message);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization']; 
        if (!authHeader) {
          return undefined;
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
          return undefined;
        }
        return token;
      }
    
}

        // return request.headers.authorization?.split(' ')[1]; from video is not working


        // const [type, token] = request.headers.authorization?.split(' ') ?? [];
        // return type === 'Bearer' ? token : undefined; from vsc is not working

        // const authHeader = request.headers['authorization']; 
        // if (!authHeader) {
        //   return undefined;
        // }
        // const [bearer, token] = authHeader.split(' ');
        // if (bearer !== 'Bearer' || !token) {
        //   return undefined;
        // }
        // return token; from gpt is working
