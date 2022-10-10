import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export default class FileUploadDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string
}
