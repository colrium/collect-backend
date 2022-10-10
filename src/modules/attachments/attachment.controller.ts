import { Body, Controller, Get, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Express } from "express"
import { ApiTags } from "@nestjs/swagger"
import AttachmentService from "./attachment.service"
import { FileUploadDto } from "./dto"

@ApiTags("Attachments")
@Controller("attachments")
export default class AttachmentController {
	constructor(private readonly attachmentService: AttachmentService) {}

	@Get()
	sayHello() {
		return this.attachmentService.getHello()
	}

	@UseInterceptors(FileInterceptor("file"))
	@Post("upload")
	uploadFile(@Body() body: FileUploadDto, @UploadedFile() file: Express.Multer.File) {
		return {
			body,
			file: file.buffer.toString(),
		}
	}

	@UseInterceptors(FileInterceptor("file"))
	@Post("upload/pass-validation")
	uploadFileAndPassValidation(
		@Body() body: FileUploadDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: "json",
				})
				.build({
					fileIsRequired: false,
				})
		)
		file?: Express.Multer.File
	) {
		return {
			body,
			file: file?.buffer.toString(),
		}
	}

	@UseInterceptors(FileInterceptor("file"))
	@Post("upload/fail-validation")
	uploadFileAndFailValidation(
		@Body() body: FileUploadDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: "jpg",
				})
				.build()
		)
		file: Express.Multer.File
	) {
		return {
			body,
			file: file.buffer.toString(),
		}
	}
}
