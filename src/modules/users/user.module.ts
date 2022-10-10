import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import User from "./user.entity"
import UserService from "./user.service"
import UserSubscriber from "./user.subscriber"
import UserController from "./user.controller"
import UserCommand from "./user.command"

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserCommand, UserService, UserSubscriber],
	controllers: [UserController],
	exports: [UserService],
})
export default class UserModule {}
