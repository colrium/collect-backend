import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsValidUUID } from '../../decorators';
import { MongoBaseDocument, MongoSchema } from '../../dynamic/mongo';

export type TeamMemberDocument = TeamMember & Document;

@MongoSchema({
	collection: 'team.members'
})
export class TeamMember extends MongoBaseDocument {
	@ApiProperty({
		example: new Types.ObjectId().toString(),
		description: "The teams's Id"
	})
	@IsValidUUID()
	@Prop({ type: String, required: true })
	teamId: string;

	@ApiProperty({
		example: new Types.ObjectId().toString(),
		description: "The user's Id"
	})
	@IsString()
	@IsValidUUID()
	@Prop({ type: String, required: true })
	userId: string;
}

const ModelSchema = SchemaFactory.createForClass(TeamMember);

ModelSchema.index({
	name: 'text',
	description: 'text'
});

export { ModelSchema as TeamMemberSchema };
