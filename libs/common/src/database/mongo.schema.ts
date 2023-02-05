import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Expose, Exclude, Transform } from 'class-transformer';

@Schema({
	toJSON: {
		virtuals: true,
		getters: true
	},
	toObject: { virtuals: true, getters: true },
	versionKey: false
})
export class MongoDocument {
	@Expose({ name: 'id' })
	@Exclude()
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId;

	@Prop({ type: Date, default: Date.now })
	createdAt: Date;

	@Prop({ type: Date, default: null })
	updatedAt: Date;

	@Prop({ type: Date, default: null })
	deletedAt: Date;
}
