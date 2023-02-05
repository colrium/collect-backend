import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions
} from 'class-validator';
import uuid from 'uuid';

export const IsValidUUID = (
	validationOptions?: ValidationOptions
): PropertyDecorator => {
	return (object: Record<string, unknown>, propertyName: string) => {
		registerDecorator({
			name: 'IsValidUUIdString',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const { version = 4 } = { ...args };
					return (
						uuid.validate(value) && uuid.version(value) === version
					);
				}
			}
		});
	};
};
