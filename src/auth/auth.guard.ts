import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);

    const req = gqlCtx.getContext()
      ? gqlCtx.getContext().req
      : context.switchToHttp().getRequest();
    const operationName = gqlCtx.getContext()
      ? gqlCtx.getInfo().fieldName
      : context.switchToHttp().getRequest().route.path;

    const token = req.headers
      ? req.headers.authorization
      : (req.Authorization || req.authorization) as string;

    const user = await this.authService.validateUser(token, operationName);

    req.session = user;

    if (user) return true;
  }
}