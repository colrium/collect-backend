import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator';
import { Types } from 'mongoose';

export const IsObjectIdString = (
	validationOptions?: ValidationOptions
): PropertyDecorator => {
	return (object: Record<string, unknown>, propertyName: string) => {
		registerDecorator({
			name: 'IsObjectIdString',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return Types.ObjectId.isValid(value);
				},
			},
		});
	};
};
