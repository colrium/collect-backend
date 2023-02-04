import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import uuid from 'uuid';
import { IsValidUUID } from '../../decorators';
import { MongoBaseDocument, MongoSchema } from '../../dynamic/mongo';
import { Cryptography } from '../../utils';

export type UserPasswordDocument = UserPassword & Document;

@MongoSchema({
	collection: 'user.password',
})
export class UserPassword extends MongoBaseDocument {
	@ApiProperty({
		example: uuid.v4(),
		description: 'The User Id',
	})
	@IsString()
	@IsValidUUID()
	@Prop({ type: String, required: true })
	userId: string;

	@ApiProperty({
		example: 'Pj3yNRWQVCLjQfQL',
		description: "The user's Password",
	})
	@IsString()
	@IsNotEmpty()
	@Exclude()
	@Prop({ type: String, required: true, private: true })
	password: string;

	@ApiProperty({ example: false, description: 'The status of the password' })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: false, default: true })
	isActive: string;

	@Prop({ type: Date, default: Date.now })
	setOn: Date;
}

const ModelSchema = SchemaFactory.createForClass(UserPassword);

ModelSchema.index({
	password: 'text',
});

ModelSchema.pre('save', async function (this: UserPassword, next) {
	if (!/\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}/.test(this.password)) {
		this.password = /\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}/.test(
			this.password
		)
			? this.password
			: await Cryptography.toHash(this.password);
	}
	next();
});

export { ModelSchema as UserPasswordSchema };
