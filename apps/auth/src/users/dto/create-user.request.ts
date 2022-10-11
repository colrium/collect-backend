import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from "@nestjs/swagger"
import { User } from "../schemas/user.schema"

export class CreateUserRequest extends User {}
