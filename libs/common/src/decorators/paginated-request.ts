import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const PaginatedRequest = <TModel extends Type<any>>(model: TModel) => {
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
	console.log('PaginatedRequest model', model);
	return applyDecorators(...decorators);
};
