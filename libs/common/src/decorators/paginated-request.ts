import { applyDecorators, Type, Query } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiProperty,
	ApiOkResponse,
	getSchemaPath,
	ApiQuery,
	ApiQueryOptions,
} from '@nestjs/swagger';
import { PageDto } from '../dto/page.dto';

export const PaginatedRequest = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiQuery({
			name: 'pagination',
			description: `Number of ${model.name} records per page`,
			type: Number,
			default: 10,
			required: false,
		}),
		ApiQuery({
			name: 'page',
			description: `Page Number of to evaluate number of ${model.name} records to skip`,
			type: Number,
			default: 1,
			required: false,
		})
	);
};
