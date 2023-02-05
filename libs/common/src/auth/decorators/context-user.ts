import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models';

export const getExecutionContextUser = (context: ExecutionContext): User => {
	if (context.getType() === 'http') {
		return context.switchToHttp().getRequest().user;
	}
	if (context.getType() === 'rpc') {
		return context.switchToRpc().getData().user;
	}
};

export const ContextUser = createParamDecorator(
	(_data: unknown, context: ExecutionContext) =>
		getExecutionContextUser(context)
);
