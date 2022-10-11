import { Prop, Schema } from "@nestjs/mongoose"
import { SchemaTypes, Types, Document } from "mongoose"

@Schema({
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id?.toHexString() || ret._id.toString() || ret._id
			delete ret._id
			delete ret.__v
		},
		virtuals: true,
		getters: true,
	},
	toObject: { virtuals: true, getters: true },
})
export class MongoDocument {
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId
}
