import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { IsValidUUID } from '../../decorators';
import { MongoBaseDocument, MongoSchema } from '../../dynamic/mongo';
import { Cryptography } from '../../utils';

export type UserPasswordDocument = UserPassword & Document;

@MongoSchema({
	collection: 'user.password',
})
export class UserPassword extends MongoBaseDocument {
	@ApiProperty({
		example: uuidv4(),
		description: 'The User Id',
	})
	@IsString()
	@IsValidUUID()
	@Prop({ type: String, required: true })
	userId: string;

	@IsString()
	@IsNotEmpty()
	@Exclude()
	@Prop({ type: String, required: true, private: true })
	hash: string;

	@ApiProperty({ example: false, description: 'The status of the password' })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: Boolean, required: false, default: true })
	isActive: boolean;

	@Prop({ type: Date, default: Date.now })
	setOn: Date;
}

const ModelSchema = SchemaFactory.createForClass(UserPassword);

ModelSchema.index({
	password: 'text',
});

ModelSchema.pre('save', async function (this: UserPassword, next) {
	if (!/\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}/.test(this.hash)) {
		this.hash = /\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}/.test(this.hash)
			? this.hash
			: await Cryptography.toHash(this.hash);
	}
	next();
});

export { ModelSchema as UserPasswordSchema };
