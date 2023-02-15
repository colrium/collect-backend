import { applyDecorators, Logger, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiMongoFilterQuery = <T extends Type<any>>(model: T) => {
	const logger = new Logger(`${ApiMongoFilterQuery.name}-${model?.name}`);
	const decorators = [
		ApiQuery({
			name: 'pagination',
			description: `Number of ${model.name} records per page`,
			type: Number,
			// default: 10,
			required: false
		}),
		ApiQuery({
			name: 'page',
			description: `Page Number of to evaluate number of ${model.name} records to skip`,
			type: Number,
			// default: 1,
			required: false
		})
	];
	if (typeof model === 'object') {
		// logger.verbose('model', model);
	}
	logger.verbose('model', model);
	return applyDecorators(...decorators);
};
