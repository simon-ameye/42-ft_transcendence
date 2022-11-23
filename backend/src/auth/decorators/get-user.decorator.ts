import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// It will extract user from a request
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
		// switchToHttp is the execution context, we could have web socket or RPC
		// getRequest will get the request from the librairy express
    const request = ctx.switchToHttp().getRequest();
    return (request.user);
  },
);
