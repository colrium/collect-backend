import { IsIn, IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import UserRole from "../user.role.enum"
export default class CreateUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	firstName: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	lastName: string

	@ApiProperty()
	@MinLength(7, { message: "password is too short" })
	password: string

	@ApiProperty()
	@IsNotEmpty()
	roles: UserRole[]

	@ApiPropertyOptional()
	@IsString()
	provider: string
}
