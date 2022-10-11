import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Length, IsNotEmpty, IsEmail } from "class-validator"
import { Exclude } from "class-transformer"
import { HookNextFunction } from "mongoose"
import { MongoDocument, Role, Password } from "@app/common"

@Schema({ versionKey: false })
export class User extends MongoDocument {
	@ApiProperty({ example: "user@example.com", description: "The email of the User" })
	@Prop({ unique: true })
	email: string

	@ApiProperty({ example: "John", description: "The first name of the User" })
	@Prop()
	firstName: string

	@ApiProperty({ example: "Doe", description: "The last name of the User" })
	@Prop()
	lastName: string

	fullName: string

	@ApiProperty({ example: "070000000", description: "The phone number of the User" })
	@Prop()
	phoneNumber: string

	@ApiProperty({ example: "KE", description: "The country code of the User" })
	@Prop()
	country: string

	@Prop()
	@Exclude()
	password: string

	@ApiProperty({
		type: "array",
		items: {
			type: "string",
		},
		example: [Roles.GUEST],
		description: "The roles of the User",
	})
	@Prop({ type: Set, enum: Role, default: [Role.GUEST] })
	roles: Role[]

	@ApiProperty({ example: "active", description: "Status of the user" })
	@Prop({
		type: "string",
		default: "active",
	})
	status: string
}

let UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ email: "text", email: "text", firstName: "text", lastName: "text", email: "text" })

UserSchema.virtual("fullName").get(function (this: User) {
	return `${this.firstName} ${this.lastName}`
})

UserSchema.pre("save", async function (this: User, next: HookNextFunction) {
	if (this.isModified("password") || this.isNew) {
		this.password = /\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}/.test(this.password) ? this.password : await Password.toHash(this.password)
	}
	next()
})

export { UserSchema }
