import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Length, IsNotEmpty, IsEmail, IsString } from "class-validator"
import { Exclude } from "class-transformer"
import { MongoDocument, Role, Password } from "@app/common"

export type UserDocument = User & Document

@Schema({ versionKey: false })
export class User extends MongoDocument {
	@ApiProperty({ example: "user@example.com", description: "The email of the User" })
	@IsEmail()
	@IsString()
	@Prop({ type: String, required: true, unique: true })
	email: string

	@ApiProperty({ example: "John", description: "The first name of the User" })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: true })
	firstName: string

	@ApiProperty({ example: "Doe", description: "The last name of the User" })
	@Prop({ type: String, required: true })
	lastName: string

	fullName: string

	@ApiProperty({ example: "070000000", description: "The phone number of the User" })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String })
	phoneNumber: string

	@Exclude()
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String, required: true })
	password: string

	@ApiProperty({
		type: "array",
		items: {
			type: "string",
		},
		example: [Role.GUEST],
		description: "The roles of the User",
	})
	@Prop([{ type: String, enum: Role, default: [Role.GUEST] }])
	roles: Role[]

	@ApiProperty({ example: "USER001", description: "The user's Staff ID" })
	@Prop({ type: String, default: null })
	staffId: string

	@ApiProperty({ example: "active", description: "Status of the user" })
	@IsString()
	@IsNotEmpty()
	@Prop({
		type: String,
		required: true,
		default: "active",
	})
	status: string

	@ApiProperty({ example: "KE", description: "The country code of the User" })
	@IsString()
	@IsNotEmpty()
	@Prop({ type: String })
	country: string

	@ApiProperty({ example: "Nairobi", description: "The city of the User" })
	@Prop({ type: String })
	city: string

	@ApiProperty({ example: "Nairobi City", description: "The user's administration level 1 name" })
	@Prop({ type: String })
	adminLevel1: string

	@ApiProperty({ example: "Starehe", description: "The user's administration level 2 name" })
	@Prop({ type: String })
	adminLevel2: string

	@ApiProperty({ example: "Starehe", description: "The user's administration level 3 name" })
	@Prop({ type: String })
	adminLevel3: string

	@ApiProperty({ example: "CBD", description: "The user's administration level 4 name" })
	@Prop({ type: String })
	adminLevel4: string

	@Exclude()
	@Prop({ type: String })
	accountConfirmationCode: string

	@Exclude()
	@Prop({ type: String })
	passwordResetCode: string
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
	accountConfirmationCode: "text",
	passwordResetCode: "text",
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
