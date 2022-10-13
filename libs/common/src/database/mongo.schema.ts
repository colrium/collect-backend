import { Prop, Schema } from "@nestjs/mongoose"
import { SchemaTypes, Types, Document } from "mongoose"
import { Expose, Exclude, Transform } from "class-transformer"

export class MongoDocument {
	@Expose({ name: "id" })
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId
}
