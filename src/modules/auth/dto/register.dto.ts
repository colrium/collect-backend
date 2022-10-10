import { PartialType } from "@nestjs/swagger"
import { CreateUserDto } from "../../users"

export default class RegisterDto extends PartialType(CreateUserDto) {}
