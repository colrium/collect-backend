import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import AttachmentController from "./attachment.controller"
import AttachmentService from "./attachment.service"
import Attachment from "./attachment.entity"

@Module({
	imports: [TypeOrmModule.forFeature([Attachment])],
	controllers: [AttachmentController],
	providers: [AttachmentService],
})
export default class AttachmentModule {}
