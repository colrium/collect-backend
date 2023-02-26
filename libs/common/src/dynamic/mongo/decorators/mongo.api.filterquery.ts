import { applyDecorators, Logger } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';
import { Schema, SchemaType } from 'mongoose';
export interface ISchema extends Schema {
	options?: any;
	caster?: any;
}
export interface ISchemaType extends SchemaType {
	caster?: any;
}
export const ApiMongoFilterQuery = <T extends ISchema>(schema: T) => {
	const logger = new Logger(`${ApiMongoFilterQuery.name}`);
	const decorators = [
		ApiQuery({
			name: 'pagination',
			description: `Number of ${schema.options.collection} per page`,
			type: Number,
			// default: 10,
			required: false
		}),
		ApiQuery({
			name: 'page',
			description: `Page Number of to evaluate number of ${schema.options.collection} to skip`,
			type: Number,
			// default: 1,
			required: false
		})
	];
	if (typeof schema.paths === 'object') {
		const paths = Object.entries(schema.paths);
		for (const [key, value] of paths) {
			const { path, instance, options, caster }: ISchemaType = value;
			if (!options?.private && path !== '_id') {
				const pathQueryOptions: ApiQueryOptions = {
					name: key,
					description: instance,
					required: false,
					type: instance
					// default: 1,
				};
				if (Array.isArray(caster?.enumValues)) {
					pathQueryOptions.enum = caster.enumValues;
					pathQueryOptions.isArray = true;
					pathQueryOptions.explode = true;
				}
				decorators.push(ApiQuery(pathQueryOptions));
			}
			// logger.verbose('schema path', key);
		}
	}

	return applyDecorators(...decorators);
};
