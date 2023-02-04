import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import uuid from 'uuid';
import { IsValidUUID } from '../../decorators';
import { MongoBaseDocument } from '../../dynamic/mongo';

export type TeamDocument = Team & Document;

export class Team extends MongoBaseDocument {
	@ApiProperty({
		example: 'Team A',
		description: "The teams's Name",
	})
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: true })
	name: string;

	@ApiProperty({
		example: 'Team A Description',
		description: "The teams's Description",
	})
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: false })
	description: string;

	@ApiProperty({
		example: uuid.v4(),
		description: "The lead user's Id",
	})
	@IsValidUUID()
	@Prop({ type: String, required: false, default: null })
	leadUserId: string;

	@ApiProperty({ example: true, description: 'The status of the team' })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: Boolean, required: false, default: true })
	isActive: boolean;
}

const ModelSchema = SchemaFactory.createForClass(Team);

ModelSchema.index({
	name: 'text',
	description: 'text',
});

export { ModelSchema as TeamSchema };
