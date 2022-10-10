import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export default class LoginDto {
	@ApiProperty({
		description: "Email address of the user",
		example: "user@example.com",
	})
	@IsNotEmpty()
	@IsEmail()
	username: string

	@ApiProperty({
		description: "Password in plain text",
		example: "Password@123",
	})
	@IsNotEmpty()
	password: string
}
