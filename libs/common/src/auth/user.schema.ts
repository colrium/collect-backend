import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Length, IsNotEmpty, IsEmail, IsString } from "class-validator"
import { Exclude } from "class-transformer"
import { MongoDocument } from "../database"
import { Role } from './types';
import { Password } from '../utils';

export type UserDocument = User & Document

@Schema({
	toJSON: {
		virtuals: true,
		getters: true,
	},
	toObject: { virtuals: true, getters: true },
	versionKey: false,
})
export class User extends MongoDocument {
	@ApiProperty({
		example: "user@example.com",
		description: "The email of the User",
	})
	@IsEmail()
	@IsString()
	@Prop({ type: String, required: true, unique: true })
	email: string

	@ApiProperty({
		example: "Pj3yNRWQVCLjQfQL",
		description: "The user's Password",
	})
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: true, private: true })
	password: string

	@ApiProperty({ example: "John", description: "The first name of the User" })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: true })
	firstName: string

	@ApiProperty({ example: "Doe", description: "The last name of the User" })
	@Prop({ type: String, required: true })
	lastName: string

	fullName?: string

	@ApiProperty({
		example: "070000000",
		description: "The phone number of the User",
	})
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, default: null })
	phoneNumber?: string

	@ApiProperty({
		type: "array",
		items: {
			type: "string",
		},
		example: [Role.GUEST],
		description: "The roles of the User",
	})
	@Prop([{ type: String, enum: Role, default: [Role.GUEST], private: true }])
	roles: Role[]

	@ApiProperty({ example: "USER001", description: "The user's Staff ID" })
	@Prop({ type: String, default: null })
	staffId: string

	@ApiProperty({ example: "active", description: "Status of the user" })
	@IsString()
	@IsNotEmpty()
	@Prop({
		type: String,
		default: "active",
	})
	status: string

	@ApiProperty({ example: "KE", description: "The country code of the User" })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, default: null })
	country?: string

	@ApiProperty({ example: "Nairobi", description: "The city of the User" })
	@Prop({ type: String, default: null })
	city?: string

	@ApiProperty({
		example: "Nairobi City",
		description: "The user's administration level 1 name",
	})
	@Prop({ type: String, default: null })
	adminLevel1?: string

	@ApiProperty({
		example: "Starehe",
		description: "The user's administration level 2 name",
	})
	@Prop({ type: String, default: null })
	adminLevel2?: string

	@ApiProperty({
		example: "Starehe",
		description: "The user's administration level 3 name",
	})
	@Prop({ type: String, default: null })
	adminLevel3?: string

	@ApiProperty({
		example: "CBD",
		description: "The user's administration level 4 name",
	})
	@Prop({ type: String, default: null })
	adminLevel4?: string

	@Exclude()
	@Prop({ type: String, default: null, private: true })
	accountConfirmationCode?: string

	@Exclude()
	@Prop({ type: String, default: null, private: true })
	passwordResetCode?: string
}

let UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({
	email: "text",
	phoneNumber: "text",
	firstName: "text",
	lastName: "text",
	status: "text",
	country: "text",
	city: "text",
	adminLevel1: "text",
	adminLevel2: "text",
	adminLevel3: "text",
	adminLevel4: "text",
	staffId: "text",
})

UserSchema.virtual("fullName").get(function (this: UserDocument) {
	return `${this.firstName} ${this.lastName}`
})

UserSchema.pre("save", async function (this: User, next) {
	if (!/\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}/.test(this.password)) {
		this.password = /\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}/.test(this.password) ? this.password : await Password.toHash(this.password)
	}
	next()
})

export { UserSchema }
