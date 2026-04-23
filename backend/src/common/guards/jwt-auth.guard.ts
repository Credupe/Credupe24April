import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/roles.decorator';

/**
 * JWT guard with **optional-auth on @Public() routes**.
 *
 * - Protected routes behave like the stock passport-jwt guard: missing /
 *   invalid tokens → 401.
 * - `@Public()` routes always return true, but we still attempt to run the
 *   strategy so `req.user` is populated when a valid Bearer token is sent.
 *   This enables "anonymous-by-default, personalised-when-logged-in" endpoints
 *   (e.g. POST /api/v1/quotes binds the quote to the caller if authenticated).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      // Attempt auth, but never fail the request — req.user stays undefined
      // when no / invalid token is supplied.
      try {
        const result = super.canActivate(ctx);
        if (result instanceof Observable) {
          await new Promise<void>((resolve) => result.subscribe({ next: () => resolve(), error: () => resolve(), complete: () => resolve() }));
        } else {
          await Promise.resolve(result).catch(() => undefined);
        }
      } catch {
        /* swallow — optional auth */
      }
      return true;
    }

    return (await super.canActivate(ctx)) as boolean;
  }

  /**
   * For public routes we tolerate missing/invalid tokens (return the user
   * when available, undefined otherwise — never throw). For protected
   * routes the default passport behaviour applies.
   */
  handleRequest<TUser = any>(err: any, user: any, info: any, ctx: ExecutionContext): TUser {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return user ?? (undefined as any);
    return super.handleRequest(err, user, info, ctx);
  }
}
