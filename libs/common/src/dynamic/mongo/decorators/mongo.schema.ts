import { applyDecorators } from '@nestjs/common';
import { Schema } from '@nestjs/mongoose';

export interface MongoSchemaOptions {
	_id?: boolean;
	toJSON?: any;
	toObject?: any;
	versionKey?: boolean;
	collection?: string;
	removePrivatePaths?: boolean;
}
const defaultOptions: MongoSchemaOptions = {
	// _id: false,
	removePrivatePaths: true,
	toJSON: {
		virtuals: true,
		getters: true
	},
	toObject: { virtuals: true, getters: true },
	versionKey: false
};
export const MongoSchema = <TOptions extends Partial<MongoSchemaOptions>>(
	options?: TOptions
) => {
	return applyDecorators(
		Schema({
			...defaultOptions,
			...options
		})
	);
};
